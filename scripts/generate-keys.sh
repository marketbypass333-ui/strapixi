#!/bin/bash

# StrapiXi Secure Key Generator
# Generates secure random keys for Strapi environment variables

set -e

echo "🔐 StrapiXi Secure Key Generator"
echo "================================="
echo ""

# Function to generate random string
generate_key() {
    openssl rand -base64 32 | tr -d "=+/" | cut -c1-32
}

# Generate keys
APP_KEY1=$(generate_key)
APP_KEY2=$(generate_key)
APP_KEY3=$(generate_key)
APP_KEY4=$(generate_key)
ADMIN_JWT_SECRET=$(generate_key)
API_TOKEN_SALT=$(generate_key)
JWT_SECRET=$(generate_key)
TRANSFER_TOKEN_SALT=$(generate_key)

# Display generated keys
echo "Generated secure keys for your Strapi application:"
echo ""
echo "Copy these values to your .env file:"
echo ""
echo "# Application Keys"
echo "APP_KEYS=$APP_KEY1,$APP_KEY2,$APP_KEY3,$APP_KEY4"
echo ""
echo "# JWT Secrets"
echo "ADMIN_JWT_SECRET=$ADMIN_JWT_SECRET"
echo "JWT_SECRET=$JWT_SECRET"
echo ""
echo "# Salts"
echo "API_TOKEN_SALT=$API_TOKEN_SALT"
echo "TRANSFER_TOKEN_SALT=$TRANSFER_TOKEN_SALT"
echo ""
echo "================================="
echo ""
echo "⚠️  IMPORTANT SECURITY NOTES:"
echo ""
echo "1. Keep these keys SECRET and NEVER commit them to version control"
echo "2. Use different keys for each environment (dev, staging, production)"
echo "3. Store production keys in a secure secrets manager"
echo "4. Rotate keys periodically for enhanced security"
echo "5. If keys are compromised, generate new ones immediately"
echo ""

# Option to write to .env file
read -p "Would you like to update your .env file with these keys? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if [ -f ".env" ]; then
        # Backup existing .env
        cp .env .env.backup.$(date +%Y%m%d_%H%M%S)
        echo "✓ Backed up existing .env file"
    fi
    
    # Update or create .env file
    if [ ! -f ".env" ]; then
        cp .env.example .env
        echo "✓ Created .env from .env.example"
    fi
    
    # Update keys in .env
    sed -i.tmp "s/^APP_KEYS=.*/APP_KEYS=$APP_KEY1,$APP_KEY2,$APP_KEY3,$APP_KEY4/" .env
    sed -i.tmp "s/^ADMIN_JWT_SECRET=.*/ADMIN_JWT_SECRET=$ADMIN_JWT_SECRET/" .env
    sed -i.tmp "s/^JWT_SECRET=.*/JWT_SECRET=$JWT_SECRET/" .env
    sed -i.tmp "s/^API_TOKEN_SALT=.*/API_TOKEN_SALT=$API_TOKEN_SALT/" .env
    sed -i.tmp "s/^TRANSFER_TOKEN_SALT=.*/TRANSFER_TOKEN_SALT=$TRANSFER_TOKEN_SALT/" .env
    rm -f .env.tmp
    
    echo "✓ Updated .env file with new keys"
    echo ""
    echo "Your .env file has been updated. Please review and configure"
    echo "the remaining settings (database, Redis, social media APIs)."
else
    echo ""
    echo "Keys not written to .env. Copy them manually from above."
fi

echo ""
echo "Done! 🎉"
echo ""
