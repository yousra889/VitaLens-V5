variable "environment" {
  description = "Deployment environment name"
  type        = string
  default     = "dev"
}

variable "namespace" {
  description = "Kubernetes namespace for VitaLens resources"
  type        = string
  default     = "vitalens"
}

variable "kubeconfig_path" {
  description = "Path to the kubeconfig file used to reach the cluster"
  type        = string
  default     = "~/.kube/config"
}
