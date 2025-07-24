terraform {
  backend "azurerm" {
    resource_group_name  = "tfstate-rg"        # RG z kroku 0.5
    storage_account_name = "montyhalltfstate10648" # SA z kroku 0.5
    container_name       = "tfstate"          # utworzyłeś w 0.5
    key                  = "monty-hall-simulator.tfstate"
  }
}
