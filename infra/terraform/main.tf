terraform {
  required_version = ">= 1.7"

  required_providers {
    # TODO: pick your target and uncomment. Sprint 0 only needs the
    # skeleton in place - the checklist's "Déploiement K8s" step
    # (Sprint 6) is what actually needs this filled in.
    #
    # kubernetes = {
    #   source  = "hashicorp/kubernetes"
    #   version = "~> 2.31"
    # }
    #
    # AWS example:
    # aws = {
    #   source  = "hashicorp/aws"
    #   version = "~> 5.0"
    # }
  }

  # backend "s3" {} / backend "remote" {} - configure once you know
  # where state will live. Local state is fine while solo.
}

# provider "kubernetes" {
#   config_path = var.kubeconfig_path
# }
