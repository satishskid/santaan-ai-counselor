# API Integration Testing Guide

## 1. Test Groq API Integration

### Setup:
1. Go to Admin Panel: http://localhost:5173/admin
2. Select "Groq" as provider
3. Enter your Groq API key
4. Set model: `llama3-8b-8192`
5. Click "Test Connection"

### Expected Results:
- ✅ Connection successful message
- ✅ Response time < 2 seconds
- ✅ Valid JSON response

### Test Persona Generation:
1. Click "Test Persona Generation"
2. Wait for completion

### Expected Results:
- ✅ Detailed patient analysis
- ✅ Psychological profile
- ✅ Intervention plan with phases
- ✅ Personalized strategies

## 2. Test OpenRouter API Integration

### Setup:
1. Select "OpenRouter" as provider
2. Enter your OpenRouter API key
3. Set model: `meta-llama/llama-3.1-8b-instruct:free`
4. Click "Test Connection"

### Expected Results:
- ✅ Connection successful
- ✅ Model validation
- ✅ Rate limit information

## 3. Test Hugging Face Integration

### Setup:
1. Select "Hugging Face" as provider
2. Enter your HF API key
3. Set model: `microsoft/DialoGPT-large`
4. Click "Test Connection"

### Expected Results:
- ✅ Connection successful
- ✅ Model availability confirmed

## 4. Test AI Persona Generator with Real APIs

### Full Workflow Test:
1. Go to AI Persona Generator: http://localhost:5173/ai-persona
2. Click "Load Sample Patient"
3. Verify patient data displays
4. Click "Generate AI Analysis"
5. Monitor progress bar
6. Review generated results

### Expected Results:
- ✅ Real-time progress updates
- ✅ Comprehensive persona analysis
- ✅ Multi-phase intervention plan
- ✅ Actionable recommendations
- ✅ Clinical insights

## 5. Test Error Handling

### Invalid API Key Test:
1. Enter invalid API key
2. Click "Test Connection"

### Expected Results:
- ✅ Clear error message
- ✅ Helpful troubleshooting tips
- ✅ No application crash

### Network Error Test:
1. Disconnect internet
2. Try API call

### Expected Results:
- ✅ Graceful fallback to mock data
- ✅ User notification of offline mode
- ✅ Continued functionality

## 6. Performance Testing

### Load Testing:
1. Generate multiple personas rapidly
2. Monitor response times
3. Check memory usage

### Expected Results:
- ✅ Response time < 5 seconds
- ✅ No memory leaks
- ✅ Stable performance

## 7. Data Persistence Testing

### Configuration Persistence:
1. Configure API settings
2. Save configuration
3. Refresh browser
4. Check if settings persist

### Expected Results:
- ✅ API keys saved securely
- ✅ Settings restored on reload
- ✅ No re-entry required

## 8. Cross-Browser Testing

### Test in Multiple Browsers:
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

### Expected Results:
- ✅ Consistent functionality
- ✅ Proper styling
- ✅ No browser-specific errors

## 9. Mobile Responsiveness

### Test on Mobile Devices:
- [ ] iPhone/iOS Safari
- [ ] Android Chrome
- [ ] Tablet view

### Expected Results:
- ✅ Responsive design
- ✅ Touch-friendly interface
- ✅ Readable text and buttons

## 10. Security Testing

### API Key Security:
1. Check browser developer tools
2. Verify API keys are not exposed
3. Test encrypted storage

### Expected Results:
- ✅ API keys encrypted in storage
- ✅ No keys visible in network tab
- ✅ Secure transmission
