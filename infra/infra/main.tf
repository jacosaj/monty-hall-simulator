locals {
  project  = "montyhall"          # krótkie i czytelne prefixy
  location = var.location
}

# ---------------- Resource Group ----------------
resource "azurerm_resource_group" "rg" {
  name     = "${local.project}-rg"
  location = local.location
}

# ---------------- Static Website ----------------
resource "azurerm_storage_account" "static" {
  name                     = "${local.project}sa"   # => montyhallsa
  resource_group_name      = azurerm_resource_group.rg.name
  location                 = local.location
  account_tier             = "Standard"
  account_replication_type = "LRS"

  static_website {
    index_document     = "index.html"
    error_404_document = "404.html"
  }

  tags = {
    environment = "prod"
    project     = local.project
  }
}

# ---------------- Outputs ----------------
output "static_site_url" {
  description = "Public URL of the static website"
  value       = azurerm_storage_account.static.primary_web_endpoint
}
