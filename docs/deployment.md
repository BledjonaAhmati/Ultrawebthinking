# 🎯 Deployment Guide

## Overview

This guide covers deployment strategies for the UltraThinking Monorepo across different environments.

---

## 🐳 Docker Deployment

### Development

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Production

```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Deploy
docker-compose -f docker-compose.prod.yml up -d

# Scale services
docker-compose -f docker-compose.prod.yml up -d --scale web-clisonix-main=3
```

---

## ☸️ Kubernetes Deployment

### Prerequisites

- Kubernetes cluster (AKS, EKS, GKE, or local)
- kubectl configured
- Helm 3+ installed

### Deploy to Kubernetes

```bash
# Create namespace
kubectl create namespace ultrathinking

# Apply ConfigMaps and Secrets
kubectl apply -f infra/infra-k8s/configmaps/
kubectl apply -f infra/infra-k8s/secrets/

# Deploy databases
kubectl apply -f infra/infra-k8s/databases/

# Deploy services
kubectl apply -f infra/infra-k8s/services/

# Check deployment status
kubectl get pods -n ultrathinking
kubectl get services -n ultrathinking
```

### Using Helm

```bash
# Install Helm chart
helm install ultrathinking ./infra/infra-k8s/helm/ultrathinking \
  --namespace ultrathinking \
  --create-namespace \
  --values ./infra/infra-k8s/helm/values/production.yaml

# Upgrade deployment
helm upgrade ultrathinking ./infra/infra-k8s/helm/ultrathinking

# Rollback
helm rollback ultrathinking
```

---

## 🏗️ Terraform Deployment

### Azure Deployment

```bash
cd infra/infra-terraform/azure

# Initialize Terraform
terraform init

# Plan deployment
terraform plan -out=tfplan

# Apply changes
terraform apply tfplan

# Destroy infrastructure
terraform destroy
```

### AWS Deployment

```bash
cd infra/infra-terraform/aws

# Set AWS credentials
export AWS_ACCESS_KEY_ID="your_key"
export AWS_SECRET_ACCESS_KEY="your_secret"

# Deploy
terraform init
terraform apply
```

---

## 🔄 CI/CD Deployment

### GitHub Actions

Automatic deployment triggered on push to specific branches:

- `develop` → Staging environment
- `main` → Production environment

### Manual Deployment

```bash
# Trigger workflow manually
gh workflow run ci-cd.yml --ref main
```

---

## 🌐 Cloud Providers

### Azure

```bash
# Login to Azure
az login

# Create resource group
az group create --name ultrathinking-prod --location eastus

# Create AKS cluster
az aks create \
  --resource-group ultrathinking-prod \
  --name ultrathinking-aks \
  --node-count 3 \
  --enable-addons monitoring \
  --generate-ssh-keys

# Get credentials
az aks get-credentials --resource-group ultrathinking-prod --name ultrathinking-aks

# Deploy
kubectl apply -f infra/infra-k8s/
```

### AWS

```bash
# Create EKS cluster
eksctl create cluster \
  --name ultrathinking-eks \
  --region us-east-1 \
  --nodes 3 \
  --node-type t3.medium

# Update kubeconfig
aws eks update-kubeconfig --name ultrathinking-eks --region us-east-1

# Deploy
kubectl apply -f infra/infra-k8s/
```

### Google Cloud

```bash
# Create GKE cluster
gcloud container clusters create ultrathinking-gke \
  --num-nodes 3 \
  --machine-type n1-standard-2 \
  --region us-central1

# Get credentials
gcloud container clusters get-credentials ultrathinking-gke --region us-central1

# Deploy
kubectl apply -f infra/infra-k8s/
```

---

## 📊 Monitoring Setup

### Prometheus & Grafana

```bash
# Install Prometheus
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm install prometheus prometheus-community/kube-prometheus-stack \
  --namespace monitoring \
  --create-namespace

# Access Grafana
kubectl port-forward -n monitoring svc/prometheus-grafana 3000:80
# Open http://localhost:3000 (admin/prom-operator)
```

---

## 🔒 Security Considerations

### Secrets Management

```bash
# Create Kubernetes secrets
kubectl create secret generic db-credentials \
  --from-literal=username=admin \
  --from-literal=password=securepassword \
  -n ultrathinking

# Using Sealed Secrets
kubeseal --format=yaml < secret.yaml > sealed-secret.yaml
kubectl apply -f sealed-secret.yaml
```

### SSL/TLS Certificates

```bash
# Install cert-manager
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.14.0/cert-manager.yaml

# Create certificate issuer
kubectl apply -f infra/infra-k8s/cert-issuer.yaml
```

---

## 🔄 Blue-Green Deployment

```bash
# Deploy blue version
kubectl apply -f infra/infra-k8s/blue/

# Test blue version
curl https://blue.ultrathinking.com/health

# Switch traffic to green
kubectl apply -f infra/infra-k8s/green/
kubectl patch service ultrathinking-svc -p '{"spec":{"selector":{"version":"green"}}}'

# Rollback if needed
kubectl patch service ultrathinking-svc -p '{"spec":{"selector":{"version":"blue"}}}'
```

---

## 🎯 Canary Deployment

```bash
# Deploy canary (10% traffic)
kubectl apply -f infra/infra-k8s/canary/

# Gradually increase traffic
kubectl scale deployment canary --replicas=2  # 20%
kubectl scale deployment canary --replicas=5  # 50%
kubectl scale deployment canary --replicas=10 # 100%

# Remove old version
kubectl delete deployment stable
```

---

## 📈 Auto-Scaling

### Horizontal Pod Autoscaler

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: web-clisonix-main-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: web-clisonix-main
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

---

## 🧪 Testing Deployment

```bash
# Smoke tests
./tools/tool-scripts/smoke-tests.sh

# Load testing
kubectl apply -f infra/infra-k8s/load-test/

# Health checks
for service in web-clisonix-main app-starbooking service-kloud-hardware; do
  curl http://localhost:$PORT/health
done
```

---

## 🚨 Rollback Procedures

### Kubernetes Rollback

```bash
# View rollout history
kubectl rollout history deployment/web-clisonix-main

# Rollback to previous version
kubectl rollout undo deployment/web-clisonix-main

# Rollback to specific revision
kubectl rollout undo deployment/web-clisonix-main --to-revision=2
```

### Docker Rollback

```bash
# Stop current version
docker-compose down

# Deploy previous version
docker-compose -f docker-compose.v1.0.0.yml up -d
```

---

## 📋 Deployment Checklist

Before deploying to production:

- [ ] All tests passing
- [ ] Code reviewed and approved
- [ ] Security scan completed
- [ ] Database migrations tested
- [ ] Backup created
- [ ] Rollback plan documented
- [ ] Monitoring alerts configured
- [ ] Load testing completed
- [ ] Documentation updated
- [ ] Stakeholders notified

---

## 🆘 Troubleshooting

### Common Issues

**Pods not starting:**
```bash
kubectl describe pod <pod-name> -n ultrathinking
kubectl logs <pod-name> -n ultrathinking
```

**Service not accessible:**
```bash
kubectl get svc -n ultrathinking
kubectl describe svc <service-name> -n ultrathinking
```

**Database connection issues:**
```bash
kubectl exec -it <pod-name> -n ultrathinking -- env | grep DATABASE
```

---

**Last Updated:** April 11, 2026  
**Maintained by:** UltraThinking DevOps Team
