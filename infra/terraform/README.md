# Terraform (skeleton)

Not filled in yet - deliberately, since it depends on where you're
hosting (a managed K8s cluster from a cloud provider, or a
self-managed one). Two things to decide before this becomes real:

1. **Provider** - uncomment/add the right block in `main.tf`
   (`kubernetes` alone if you already have a cluster; add `aws`/
   `google`/`azurerm` if Terraform should provision the cluster too).
2. **State backend** - local state (default, nothing to do) is fine
   solo; move to a remote backend if more than one person will run
   `terraform apply`.

Until then, `infra/k8s/*.yaml` (plain manifests, applied with
`kubectl apply -f`) is what actually deploys the app - that's what
the progress checklist's "Déploiement K8s" step checks against.
