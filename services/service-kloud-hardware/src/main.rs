use actix_web::{middleware, web, App, HttpServer};
use std::sync::Arc;
use tracing::{info, warn};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

mod config;
mod error;
mod handlers;
mod hardware;
mod metrics;
mod models;
mod db;

use config::Config;
use error::Result;

#[actix_web::main]
async fn main() -> Result<()> {
    // Initialize tracing
    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "service_kloud_hardware=debug,actix_web=info".into()),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();

    info!("🚀 Starting Kloud Hardware Service - RISC-V Production");

    // Load configuration
    let config = Config::from_env()?;
    info!("📋 Configuration loaded successfully");

    // Initialize database connection pool
    let db_pool = db::create_pool(&config.database_url).await?;
    info!("🗄️  Database connection pool established");

    // Run migrations
    sqlx::migrate!("./migrations")
        .run(&db_pool)
        .await
        .map_err(|e| anyhow::anyhow!("Migration failed: {}", e))?;
    info!("✅ Database migrations completed");

    // Initialize hardware manager
    let hardware_manager = Arc::new(hardware::HardwareManager::new()?);
    info!("🔧 Hardware manager initialized");

    // Start hardware monitoring
    let hw_manager_clone = hardware_manager.clone();
    tokio::spawn(async move {
        if let Err(e) = hw_manager_clone.start_monitoring().await {
            warn!("⚠️  Hardware monitoring error: {}", e);
        }
    });

    let bind_address = format!("{}:{}", config.host, config.port);
    info!("🌐 Starting HTTP server on {}", bind_address);

    HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(db_pool.clone()))
            .app_data(web::Data::new(hardware_manager.clone()))
            .wrap(middleware::Logger::default())
            .wrap(
                actix_cors::Cors::default()
                    .allow_any_origin()
                    .allow_any_method()
                    .allow_any_header()
                    .max_age(3600),
            )
            .configure(handlers::configure)
    })
    .bind(&bind_address)?
    .run()
    .await?;

    Ok(())
}
