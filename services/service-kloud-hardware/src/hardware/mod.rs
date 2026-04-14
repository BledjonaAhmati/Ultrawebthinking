use anyhow::Result;
use serde::{Deserialize, Serialize};
use std::sync::{Arc, RwLock};
use sysinfo::{System, SystemExt, CpuExt, DiskExt, NetworkExt};
use tokio::time::{interval, Duration};
use tracing::{debug, error, info};

pub mod riscv;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct HardwareMetrics {
    pub timestamp: chrono::DateTime<chrono::Utc>,
    pub cpu: CpuMetrics,
    pub memory: MemoryMetrics,
    pub disk: Vec<DiskMetrics>,
    pub network: Vec<NetworkMetrics>,
    pub riscv: Option<riscv::RiscVMetrics>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CpuMetrics {
    pub cores: usize,
    pub usage_percent: f32,
    pub frequency_mhz: u64,
    pub temperature_celsius: Option<f32>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MemoryMetrics {
    pub total_bytes: u64,
    pub used_bytes: u64,
    pub available_bytes: u64,
    pub usage_percent: f32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DiskMetrics {
    pub name: String,
    pub mount_point: String,
    pub total_bytes: u64,
    pub available_bytes: u64,
    pub usage_percent: f32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NetworkMetrics {
    pub interface: String,
    pub rx_bytes: u64,
    pub tx_bytes: u64,
    pub rx_packets: u64,
    pub tx_packets: u64,
    pub rx_errors: u64,
    pub tx_errors: u64,
}

pub struct HardwareManager {
    system: Arc<RwLock<System>>,
    current_metrics: Arc<RwLock<Option<HardwareMetrics>>>,
    riscv_controller: Option<riscv::RiscVController>,
}

impl HardwareManager {
    pub fn new() -> Result<Self> {
        let mut system = System::new_all();
        system.refresh_all();

        // Try to initialize RISC-V controller
        let riscv_controller = match riscv::RiscVController::new() {
            Ok(ctrl) => {
                info!("✅ RISC-V controller initialized");
                Some(ctrl)
            }
            Err(e) => {
                error!("⚠️  RISC-V controller not available: {}", e);
                None
            }
        };

        Ok(Self {
            system: Arc::new(RwLock::new(system)),
            current_metrics: Arc::new(RwLock::new(None)),
            riscv_controller,
        })
    }

    pub async fn start_monitoring(&self) -> Result<()> {
        let mut interval = interval(Duration::from_secs(5));
        
        loop {
            interval.tick().await;
            
            if let Err(e) = self.collect_metrics().await {
                error!("Failed to collect metrics: {}", e);
            }
        }
    }

    async fn collect_metrics(&self) -> Result<()> {
        let mut system = self.system.write().unwrap();
        system.refresh_all();

        // CPU metrics
        let cpu_usage = system.global_cpu_info().cpu_usage();
        let cpu_cores = system.cpus().len();
        let cpu_freq = system.global_cpu_info().frequency();
        
        let cpu_metrics = CpuMetrics {
            cores: cpu_cores,
            usage_percent: cpu_usage,
            frequency_mhz: cpu_freq,
            temperature_celsius: self.read_cpu_temperature(),
        };

        // Memory metrics
        let total_mem = system.total_memory();
        let used_mem = system.used_memory();
        let available_mem = system.available_memory();
        
        let memory_metrics = MemoryMetrics {
            total_bytes: total_mem,
            used_bytes: used_mem,
            available_bytes: available_mem,
            usage_percent: (used_mem as f32 / total_mem as f32) * 100.0,
        };

        // Disk metrics
        let disk_metrics: Vec<DiskMetrics> = system
            .disks()
            .iter()
            .map(|disk| {
                let total = disk.total_space();
                let available = disk.available_space();
                let used = total - available;
                
                DiskMetrics {
                    name: disk.name().to_string_lossy().to_string(),
                    mount_point: disk.mount_point().to_string_lossy().to_string(),
                    total_bytes: total,
                    available_bytes: available,
                    usage_percent: (used as f32 / total as f32) * 100.0,
                }
            })
            .collect();

        // Network metrics
        let network_metrics: Vec<NetworkMetrics> = system
            .networks()
            .iter()
            .map(|(interface, data)| NetworkMetrics {
                interface: interface.clone(),
                rx_bytes: data.received(),
                tx_bytes: data.transmitted(),
                rx_packets: data.packets_received(),
                tx_packets: data.packets_transmitted(),
                rx_errors: data.errors_on_received(),
                tx_errors: data.errors_on_transmitted(),
            })
            .collect();

        // RISC-V metrics
        let riscv_metrics = if let Some(ref controller) = self.riscv_controller {
            controller.collect_metrics().await.ok()
        } else {
            None
        };

        let metrics = HardwareMetrics {
            timestamp: chrono::Utc::now(),
            cpu: cpu_metrics,
            memory: memory_metrics,
            disk: disk_metrics,
            network: network_metrics,
            riscv: riscv_metrics,
        };

        let mut current = self.current_metrics.write().unwrap();
        *current = Some(metrics.clone());

        debug!("📊 Metrics collected: CPU: {:.1}%, MEM: {:.1}%", 
               metrics.cpu.usage_percent, 
               metrics.memory.usage_percent);

        Ok(())
    }

    fn read_cpu_temperature(&self) -> Option<f32> {
        // Try to read from /sys/class/thermal/thermal_zone0/temp
        std::fs::read_to_string("/sys/class/thermal/thermal_zone0/temp")
            .ok()
            .and_then(|s| s.trim().parse::<i32>().ok())
            .map(|temp| temp as f32 / 1000.0)
    }

    pub fn get_current_metrics(&self) -> Option<HardwareMetrics> {
        self.current_metrics.read().unwrap().clone()
    }

    pub fn get_riscv_info(&self) -> Option<riscv::RiscVInfo> {
        self.riscv_controller
            .as_ref()
            .map(|ctrl| ctrl.get_info())
    }
}
