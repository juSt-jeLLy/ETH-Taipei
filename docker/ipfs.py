import json
import requests
import yaml

# Function to fetch JSON data from IPFS using the CID (hash)
def fetch_ipfs_data(ipfs_hash):
    ipfs_url = f"https://ipfs.io/ipfs/{ipfs_hash}"
    try:
        response = requests.get(ipfs_url)
        if response.status_code == 200:
            return response.json()
        else:
            print(f"Failed to fetch from IPFS. Status: {response.status_code}")
            return None
    except Exception as e:
        print(f"Error fetching data from IPFS: {e}")
        return None

# Function to update the MCP configuration in YAML with API keys from IPFS data
def update_mcp_config_with_ipfs_data(ipfs_hash, yaml_file_path):
    # Fetch data from IPFS
    ipfs_data = fetch_ipfs_data(ipfs_hash)
    if ipfs_data is None:
        print("Failed to fetch IPFS data.")
        return

    # Load the existing YAML configuration
    try:
        with open(yaml_file_path, 'r') as yaml_file:
            config = yaml.safe_load(yaml_file)
    except Exception as e:
        print(f"Error reading the YAML file: {e}")
        return

    # Ensure 'mcp' section exists in the config
    if "mcp" not in config:
        config["mcp"] = {"servers": {}}

    # Iterate through each MCP entry in the IPFS data
    for mcp in ipfs_data.get("mcps", []):
        mcp_name = mcp.get("name")
        api_keys = mcp.get("apiKeys", {})

        # Check if the MCP server exists in the YAML config and matches exactly
        for server_name, server_config in config["mcp"]["servers"].items():
            # Match the MCP name with the server name exactly
            if server_name.lower() == mcp_name.lower() and "env" in server_config:
                print(f"Updating {server_name} with API keys...")

                # Add API keys to the 'env' section of the server config
                for api_key_name, api_key_value in api_keys.items():
                    server_config["env"][api_key_name] = api_key_value

    # Save the updated YAML configuration
    try:
        with open(yaml_file_path, 'w') as yaml_file:
            yaml.dump(config, yaml_file, default_flow_style=False)
        print(f"✅ MCP configuration updated with API keys from IPFS data in {yaml_file_path}")
    except Exception as e:
        print(f"Error writing the updated YAML file: {e}")

# Example usage:
ipfs_hash = "QmdV2J3hEtYNzd4GxGNnqNAxz8FmPD4jkSirBvxDr2TX9p"  # Replace with your IPFS CID
yaml_file_path = "fastagent.config.yaml"  # Path to your configuration YAML file

update_mcp_config_with_ipfs_data(ipfs_hash, yaml_file_path)
