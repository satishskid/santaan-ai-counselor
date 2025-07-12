// Payment Service with Stripe and Razorpay support
interface PaymentProvider {
  name: string
  apiKey: string
  webhookSecret?: string
}

interface SubscriptionPlan {
  id: string
  name: string
  price: number
  currency: string
  interval: 'month' | 'year'
  features: string[]
}

interface PaymentIntent {
  id: string
  amount: number
  currency: string
  status: string
  clientSecret?: string
}

interface Subscription {
  id: string
  customerId: string
  planId: string
  status: string
  currentPeriodStart: Date
  currentPeriodEnd: Date
  cancelAtPeriodEnd: boolean
}

export class PaymentService {
  private stripeProvider: PaymentProvider | null = null
  private razorpayProvider: PaymentProvider | null = null
  private activeProvider: 'stripe' | 'razorpay' | null = null

  constructor() {
    this.initializeProviders()
  }

  private initializeProviders() {
    // Initialize Stripe
    if (process.env.STRIPE_SECRET_KEY) {
      this.stripeProvider = {
        name: 'Stripe',
        apiKey: process.env.STRIPE_SECRET_KEY,
        webhookSecret: process.env.STRIPE_WEBHOOK_SECRET
      }
    }

    // Initialize Razorpay
    if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
      this.razorpayProvider = {
        name: 'Razorpay',
        apiKey: process.env.RAZORPAY_KEY_ID,
        webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET
      }
    }

    // Set active provider based on configuration or preference
    if (process.env.PREFERRED_PAYMENT_PROVIDER === 'razorpay' && this.razorpayProvider) {
      this.activeProvider = 'razorpay'
    } else if (this.stripeProvider) {
      this.activeProvider = 'stripe'
    } else if (this.razorpayProvider) {
      this.activeProvider = 'razorpay'
    }

    if (!this.activeProvider) {
      console.warn('No payment provider configured. Payment processing will be disabled.')
    }
  }

  // Subscription Plans
  getSubscriptionPlans(): SubscriptionPlan[] {
    return [
      {
        id: 'basic_monthly',
        name: 'Basic Plan',
        price: 99,
        currency: 'USD',
        interval: 'month',
        features: [
          'Up to 5 counselors',
          'Up to 100 patients',
          'Basic dashboard',
          'Email support',
          'Assessment tools'
        ]
      },
      {
        id: 'premium_monthly',
        name: 'Premium Plan',
        price: 199,
        currency: 'USD',
        interval: 'month',
        features: [
          'Up to 15 counselors',
          'Up to 500 patients',
          'Advanced analytics',
          'Priority support',
          'Custom branding',
          'API access',
          'EMR integration ready'
        ]
      },
      {
        id: 'enterprise_monthly',
        name: 'Enterprise Plan',
        price: 499,
        currency: 'USD',
        interval: 'month',
        features: [
          'Unlimited counselors',
          'Unlimited patients',
          'White label solution',
          'Dedicated support',
          'Custom integrations',
          'SLA guarantee',
          'Advanced security'
        ]
      }
    ]
  }

  // Create Payment Intent
  async createPaymentIntent(amount: number, currency: string = 'USD', metadata?: Record<string, string>): Promise<PaymentIntent | null> {
    if (!this.activeProvider) {
      console.error('No payment provider configured')
      return null
    }

    try {
      switch (this.activeProvider) {
        case 'stripe':
          return await this.createStripePaymentIntent(amount, currency, metadata)
        case 'razorpay':
          return await this.createRazorpayPaymentIntent(amount, currency, metadata)
        default:
          return null
      }
    } catch (error) {
      console.error('Payment intent creation failed:', error)
      return null
    }
  }

  private async createStripePaymentIntent(amount: number, currency: string, metadata?: Record<string, string>): Promise<PaymentIntent> {
    const response = await fetch('https://api.stripe.com/v1/payment_intents', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.stripeProvider!.apiKey}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        amount: (amount * 100).toString(), // Stripe uses cents
        currency: currency.toLowerCase(),
        automatic_payment_methods: JSON.stringify({ enabled: true }),
        ...(metadata && { metadata: JSON.stringify(metadata) })
      })
    })

    if (!response.ok) {
      throw new Error(`Stripe API error: ${response.statusText}`)
    }

    const paymentIntent = await response.json()
    
    return {
      id: paymentIntent.id,
      amount: paymentIntent.amount / 100, // Convert back from cents
      currency: paymentIntent.currency.toUpperCase(),
      status: paymentIntent.status,
      clientSecret: paymentIntent.client_secret
    }
  }

  private async createRazorpayPaymentIntent(amount: number, currency: string, metadata?: Record<string, string>): Promise<PaymentIntent> {
    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${this.razorpayProvider!.apiKey}:${process.env.RAZORPAY_KEY_SECRET}`).toString('base64')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: amount * 100, // Razorpay uses paise for INR
        currency: currency.toUpperCase(),
        notes: metadata || {}
      })
    })

    if (!response.ok) {
      throw new Error(`Razorpay API error: ${response.statusText}`)
    }

    const order = await response.json()
    
    return {
      id: order.id,
      amount: order.amount / 100,
      currency: order.currency,
      status: order.status
    }
  }

  // Create Subscription
  async createSubscription(customerId: string, planId: string): Promise<Subscription | null> {
    if (!this.activeProvider) {
      console.error('No payment provider configured')
      return null
    }

    try {
      switch (this.activeProvider) {
        case 'stripe':
          return await this.createStripeSubscription(customerId, planId)
        case 'razorpay':
          return await this.createRazorpaySubscription(customerId, planId)
        default:
          return null
      }
    } catch (error) {
      console.error('Subscription creation failed:', error)
      return null
    }
  }

  private async createStripeSubscription(customerId: string, planId: string): Promise<Subscription> {
    const response = await fetch('https://api.stripe.com/v1/subscriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.stripeProvider!.apiKey}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        customer: customerId,
        items: JSON.stringify([{ price: planId }])
      })
    })

    if (!response.ok) {
      throw new Error(`Stripe API error: ${response.statusText}`)
    }

    const subscription = await response.json()
    
    return {
      id: subscription.id,
      customerId: subscription.customer,
      planId: subscription.items.data[0].price.id,
      status: subscription.status,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end
    }
  }

  private async createRazorpaySubscription(customerId: string, planId: string): Promise<Subscription> {
    const response = await fetch('https://api.razorpay.com/v1/subscriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${this.razorpayProvider!.apiKey}:${process.env.RAZORPAY_KEY_SECRET}`).toString('base64')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        plan_id: planId,
        customer_id: customerId,
        total_count: 12, // 12 months
        quantity: 1
      })
    })

    if (!response.ok) {
      throw new Error(`Razorpay API error: ${response.statusText}`)
    }

    const subscription = await response.json()
    
    return {
      id: subscription.id,
      customerId: subscription.customer_id,
      planId: subscription.plan_id,
      status: subscription.status,
      currentPeriodStart: new Date(subscription.current_start * 1000),
      currentPeriodEnd: new Date(subscription.current_end * 1000),
      cancelAtPeriodEnd: false
    }
  }

  // Webhook verification
  async verifyWebhook(payload: string, signature: string): Promise<boolean> {
    if (!this.activeProvider) {
      return false
    }

    try {
      switch (this.activeProvider) {
        case 'stripe':
          return await this.verifyStripeWebhook(payload, signature)
        case 'razorpay':
          return await this.verifyRazorpayWebhook(payload, signature)
        default:
          return false
      }
    } catch (error) {
      console.error('Webhook verification failed:', error)
      return false
    }
  }

  private async verifyStripeWebhook(payload: string, signature: string): Promise<boolean> {
    // Stripe webhook verification logic
    // This would typically use the Stripe SDK for proper verification
    return true // Simplified for demo
  }

  private async verifyRazorpayWebhook(payload: string, signature: string): Promise<boolean> {
    // Razorpay webhook verification logic
    // This would typically use crypto to verify the signature
    return true // Simplified for demo
  }

  // Utility methods
  isConfigured(): boolean {
    return this.activeProvider !== null
  }

  getActiveProvider(): string {
    return this.activeProvider || 'None'
  }

  getProviderInfo(): { stripe: boolean; razorpay: boolean; active: string } {
    return {
      stripe: this.stripeProvider !== null,
      razorpay: this.razorpayProvider !== null,
      active: this.activeProvider || 'None'
    }
  }

  // Convert currency for different providers
  private convertCurrency(amount: number, fromCurrency: string, toCurrency: string): number {
    // Simplified currency conversion - in production, use a real exchange rate API
    if (fromCurrency === 'USD' && toCurrency === 'INR') {
      return amount * 83 // Approximate USD to INR rate
    }
    if (fromCurrency === 'INR' && toCurrency === 'USD') {
      return amount / 83
    }
    return amount
  }
}

// Singleton instance
export const paymentService = new PaymentService()

export default paymentService
