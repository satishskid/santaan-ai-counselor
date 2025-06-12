# 🚀 Deployment Guide - Santaan IVF Counseling Platform

## 📦 **Netlify Deployment (Recommended)**

### **Option 1: Manual Upload (Fastest)**

#### **Step 1: Download Production Build**
The production build is ready in the `dist/` folder. You can:

1. **Download the entire `dist/` folder**
2. **Zip the contents** (not the folder itself, but the files inside)
3. **Upload to Netlify**

#### **Step 2: Deploy to Netlify**
1. **Go to**: [netlify.com](https://netlify.com)
2. **Sign up/Login** with GitHub account
3. **Drag & Drop**: Upload the `dist/` folder contents
4. **Site Name**: Choose a custom name (e.g., `santaan-ivf-counseling`)
5. **Deploy**: Site will be live in 30 seconds!

#### **Step 3: Configure Custom Domain (Optional)**
1. **Domain Settings**: Go to Site Settings → Domain Management
2. **Add Custom Domain**: Enter your domain (e.g., `counseling.santaan.in`)
3. **DNS Configuration**: Update your DNS to point to Netlify
4. **SSL Certificate**: Automatically provisioned by Netlify

### **Option 2: GitHub Integration (Automated)**

#### **Step 1: Push to GitHub**
```bash
# Initialize git repository
git init
git add .
git commit -m "Initial commit: Santaan IVF Counseling Platform"

# Add remote repository
git remote add origin https://github.com/satishskid/counselortempo.git
git branch -M main
git push -u origin main
```

#### **Step 2: Connect to Netlify**
1. **New Site**: Click "New site from Git"
2. **Connect GitHub**: Authorize Netlify to access your repository
3. **Select Repository**: Choose `counselortempo`
4. **Build Settings**:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
   - **Node Version**: `18`
5. **Deploy**: Automatic deployment on every push!

## 🔧 **Environment Variables**

### **Required for Full Functionality**
```bash
# AI API Keys (Optional - has fallbacks)
VITE_GROQ_API_KEY=your_groq_api_key_here
VITE_OPENROUTER_API_KEY=your_openrouter_api_key_here
VITE_HUGGINGFACE_API_KEY=your_huggingface_api_key_here

# EMR Integration (Optional - has mock data)
VITE_EMR_API_URL=https://your-emr-api.com/api
VITE_EMR_API_KEY=your_emr_api_key_here

# App Configuration
VITE_APP_NAME=Santaan IVF Counseling
VITE_APP_URL=https://your-domain.com
```

### **Setting Environment Variables in Netlify**
1. **Site Settings**: Go to your site dashboard
2. **Environment Variables**: Navigate to Site Settings → Environment Variables
3. **Add Variables**: Add each variable with its value
4. **Redeploy**: Trigger a new deployment to apply changes

## 📱 **PWA Configuration**

### **Automatic PWA Features**
The app includes complete PWA setup:

- ✅ **Web App Manifest**: `/public/manifest.json`
- ✅ **Service Worker**: `/public/sw.js`
- ✅ **App Icons**: All sizes (72x72 to 512x512)
- ✅ **Offline Support**: Full offline functionality
- ✅ **Install Prompts**: Automatic installation banners

### **PWA Testing**
After deployment, test PWA features:

1. **Visit Patient App**: `https://your-site.netlify.app/patient-app`
2. **Install Banner**: Should appear automatically
3. **Install App**: Click "Install Santaan Patient App"
4. **Home Screen**: App icon should appear
5. **Offline Test**: Disconnect internet, app should still work

## 🔒 **Security Configuration**

### **HTTPS (Automatic)**
- Netlify provides **automatic HTTPS** for all sites
- **SSL certificates** are provisioned automatically
- **HTTP to HTTPS** redirects are enabled by default

### **Security Headers**
The `netlify.toml` file includes security headers:
- **Content Security Policy**: Prevents XSS attacks
- **X-Frame-Options**: Prevents clickjacking
- **X-Content-Type-Options**: Prevents MIME sniffing
- **Referrer Policy**: Controls referrer information

## 📊 **Performance Optimization**

### **Automatic Optimizations**
Netlify provides:
- **Global CDN**: Fast content delivery worldwide
- **Asset Optimization**: Automatic image and asset compression
- **Brotli Compression**: Better compression than gzip
- **HTTP/2**: Faster loading with multiplexing

### **Caching Strategy**
The `netlify.toml` configures:
- **Static Assets**: 1 year cache for JS/CSS/images
- **HTML**: No cache for dynamic content
- **PWA Assets**: Optimized caching for offline support

## 🌐 **Custom Domain Setup**

### **Option 1: Subdomain (Recommended)**
```
counseling.santaan.in → Netlify Site
```

**DNS Configuration**:
```
Type: CNAME
Name: counseling
Value: your-site-name.netlify.app
```

### **Option 2: Root Domain**
```
santaan.in → Netlify Site
```

**DNS Configuration**:
```
Type: A
Name: @
Value: 75.2.60.5

Type: AAAA  
Name: @
Value: 2600:1f14:e22:5500::2
```

## 📈 **Analytics & Monitoring**

### **Netlify Analytics**
1. **Enable Analytics**: Go to Site Settings → Analytics
2. **View Metrics**: Page views, unique visitors, bandwidth
3. **Performance**: Core Web Vitals and loading times

### **Custom Analytics (Optional)**
Add Google Analytics or other tracking:
```html
<!-- Add to index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## 🔄 **Continuous Deployment**

### **Automatic Deployments**
Once connected to GitHub:
- **Push to Main**: Automatic production deployment
- **Pull Requests**: Deploy previews for testing
- **Branch Deploys**: Test different features

### **Deploy Previews**
- **Every PR**: Gets its own preview URL
- **Testing**: Test changes before merging
- **Collaboration**: Share previews with team

## 🛠️ **Troubleshooting**

### **Common Issues**

#### **Build Failures**
```bash
# Check Node version
node --version  # Should be 18+

# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

#### **PWA Not Installing**
- **HTTPS Required**: PWA only works on HTTPS
- **Manifest Valid**: Check `/manifest.json` loads correctly
- **Service Worker**: Verify `/sw.js` is accessible

#### **Environment Variables Not Working**
- **Prefix Required**: All variables must start with `VITE_`
- **Rebuild Required**: Redeploy after adding variables
- **Case Sensitive**: Variable names are case-sensitive

### **Support Resources**
- **Netlify Docs**: [docs.netlify.com](https://docs.netlify.com)
- **PWA Guide**: [web.dev/progressive-web-apps](https://web.dev/progressive-web-apps)
- **GitHub Issues**: [Repository Issues](https://github.com/satishskid/counselortempo/issues)

## ✅ **Deployment Checklist**

### **Pre-Deployment**
- [ ] **Build Success**: `npm run build` completes without errors
- [ ] **Environment Variables**: All required variables configured
- [ ] **PWA Assets**: Manifest and service worker in place
- [ ] **Security**: HTTPS and security headers configured

### **Post-Deployment**
- [ ] **Site Accessible**: Main site loads correctly
- [ ] **PWA Installation**: Install prompt appears on mobile
- [ ] **Offline Functionality**: App works without internet
- [ ] **All Routes**: Test all major routes and features
- [ ] **Mobile Responsive**: Test on various device sizes
- [ ] **Performance**: Check loading times and Core Web Vitals

### **Production Ready**
- [ ] **Custom Domain**: Domain configured and SSL active
- [ ] **Analytics**: Tracking and monitoring set up
- [ ] **Error Monitoring**: Error tracking configured
- [ ] **Backup Strategy**: Regular backups scheduled

---

## 🎉 **Ready for Production!**

Your Santaan IVF Counseling Platform is now ready for production deployment with:

🎯 **Complete PWA functionality**  
📱 **Mobile-optimized patient experience**  
📊 **Real-time counselor dashboard**  
🏥 **EMR integration capabilities**  
🤖 **AI-powered interventions**  
🔒 **Enterprise-grade security**  
🚀 **Global CDN performance**  

**Deploy now and transform IVF counseling!** ✨

### **Quick Deploy URLs**
- **Netlify**: [netlify.com/drop](https://app.netlify.com/drop)
- **GitHub**: [github.com/satishskid/counselortempo](https://github.com/satishskid/counselortempo)
- **Documentation**: See README.md for complete setup guide
