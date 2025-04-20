# VPN Configuration

This directory contains the VPN configuration files and token for NordVPN.

## Setup Instructions

1. Place your NordVPN configuration file in this directory (if using custom config)
2. Create a `token.txt` file with your NordVPN token
3. Update the `.env` file with:
   - `VPN_PROV=nordvpn:region:protocol` (e.g., nordvpn:us_tampa:udp)
   - `VPN_TOKEN=your_nordvpn_token`

## Security Notes

- The `.env` file is excluded from version control
- The `token.txt` file is mounted as read-only in the container
- Store your NordVPN token securely
- Rotate your token regularly for security

## Troubleshooting

If the VPN connection fails:
1. Check your token in both `.env` and `token.txt`
2. Verify the VPN configuration file is present
3. Check container logs: `docker-compose logs vpn`
4. Ensure the region and protocol are correct in `VPN_PROV`

## NordVPN Configuration

### Supported Regions
- us_tampa
- us_new_york
- us_chicago
- uk_london
- de_frankfurt
- nl_amsterdam
- fr_paris
- jp_tokyo
- au_sydney

### Protocols
- udp (recommended for speed)
- tcp (recommended for stability)

### Example Configurations
- `nordvpn:us_tampa:udp` (Fastest US server)
- `nordvpn:uk_london:udp` (UK server)
- `nordvpn:jp_tokyo:tcp` (Japan server with TCP)

## Provider Format

The VPN provider should be specified in the format: `provider:region:protocol`

### Supported Providers and Formats

1. ExpressVPN:
   ```
   expressvpn:smart:protocol
   ```
   Protocol: udp or tcp

2. Private Internet Access (PIA):
   ```
   pia:region:protocol
   ```
   Regions: us_california, us_texas, etc.
   Protocol: udp or tcp

## Security Notes

- The .env file is excluded from version control
- VPN token is stored securely in the container
- The token.txt file is mounted as read-only
- Token-based authentication is more secure than username/password
- Rotate your token regularly for enhanced security

## Troubleshooting

If the VPN connection fails:
1. Check your token in .env and token.txt
2. Verify the VPN configuration file is correct
3. Check container logs: `docker-compose logs vpn`
4. Ensure token has not expired
5. Verify provider format is correct 