#!/bin/bash

echo "🔐 Adding Environment Variables to Vercel..."

# MONGODB_URI
echo "mongodb+srv://dorji-karigor-khujii:dorji-karigor-khujii@dorji-karigor-khujii.asjfuyi.mongodb.net/dorji-karigor-khuji?retryWrites=true&w=majority" | vercel env add MONGODB_URI --environment production
echo "mongodb+srv://dorji-karigor-khujii:dorji-karigor-khujii@dorji-karigor-khujii.asjfuyi.mongodb.net/dorji-karigor-khuji?retryWrites=true&w=majority" | vercel env add MONGODB_URI --environment preview
echo "mongodb+srv://dorji-karigor-khujii:dorji-karigor-khujii@dorji-karigor-khujii.asjfuyi.mongodb.net/dorji-karigor-khuji?retryWrites=true&w=majority" | vercel env add MONGODB_URI --environment development

# JWT_SECRET
echo "your_super_secret_jwt_key_here_change_in_production_12345" | vercel env add JWT_SECRET --environment production
echo "your_super_secret_jwt_key_here_change_in_production_12345" | vercel env add JWT_SECRET --environment preview
echo "your_super_secret_jwt_key_here_change_in_production_12345" | vercel env add JWT_SECRET --environment development

# NEXTAUTH_URL
echo "https://dorji-karigor-khuji.vercel.app" | vercel env add NEXTAUTH_URL --environment production
echo "https://dorji-karigor-khuji.vercel.app" | vercel env add NEXTAUTH_URL --environment preview
echo "https://dorji-karigor-khuji.vercel.app" | vercel env add NEXTAUTH_URL --environment development

echo "✅ All environment variables added successfully!"
echo ""
echo "📋 Current Environment Variables:"
vercel env ls
