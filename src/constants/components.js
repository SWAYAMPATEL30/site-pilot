export const UI_COMPONENTS = {
  hero: [
    {
      id: 'hero-1',
      name: 'Centered Hero with Buttons',
      html: `
<section class="py-24 flex items-center justify-center bg-white text-center">
  <div class="max-w-4xl px-4">
    <h1 class="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">Build Something Incredible</h1>
    <p class="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">Launch your product faster with our robust, AI-powered platform designed for modern teams.</p>
    <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
      <button class="px-8 py-4 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition shadow-lg">Get Started Free</button>
      <button class="px-8 py-4 bg-white text-black border border-gray-200 rounded-lg font-medium hover:bg-gray-50 transition">View Documentation</button>
    </div>
  </div>
</section>
      `
    },
    {
      id: 'hero-2',
      name: 'Split Layout Hero',
      html: `
<section class="py-20 bg-gray-50 flex items-center">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-12">
    <div class="flex-1 lg:pr-8">
      <h1 class="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight mb-6">The Future of Digital Creation is Here.</h1>
      <p class="text-lg text-gray-600 mb-8 max-w-lg">Empower your team with tools that actually make a difference. No code required.</p>
      <div class="flex gap-4">
        <button class="px-6 py-3 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition shadow-md">Start Trial</button>
        <button class="px-6 py-3 bg-transparent text-gray-700 font-semibold hover:text-blue-600 transition">Learn More &rarr;</button>
      </div>
    </div>
    <div class="flex-1">
      <div class="aspect-w-16 aspect-h-9 w-full bg-gray-200 rounded-xl overflow-hidden shadow-2xl">
        <img src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Dashboard Preview" class="object-cover w-full h-full" />
      </div>
    </div>
  </div>
</section>
      `
    }
  ],
  features: [
    {
      id: 'features-1',
      name: '3-Column Feature Grid',
      html: `
<section class="py-20 bg-white">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <h2 class="text-3xl font-bold text-gray-900 mb-4">Everything You Need</h2>
    <p class="text-gray-600 max-w-2xl mx-auto mb-16">Powerful features designed to optimize your workflow and increase conversion rates.</p>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
      <div class="p-6 border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition bg-gray-50">
        <div class="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-6 text-xl">🚀</div>
        <h3 class="text-xl font-bold text-gray-900 mb-3">Lightning Fast</h3>
        <p class="text-gray-600">Built on modern architecture ensuring zero latency and maximum speed for your users.</p>
      </div>
      <div class="p-6 border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition bg-gray-50">
        <div class="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mb-6 text-xl">🔒</div>
        <h3 class="text-xl font-bold text-gray-900 mb-3">Secure by Design</h3>
        <p class="text-gray-600">Enterprise-grade security protocols keep your data safe and compliant at all times.</p>
      </div>
      <div class="p-6 border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition bg-gray-50">
        <div class="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mb-6 text-xl">📈</div>
        <h3 class="text-xl font-bold text-gray-900 mb-3">Advanced Analytics</h3>
        <p class="text-gray-600">Gain actionable insights with real-time dashboards and comprehensive reporting tools.</p>
      </div>
    </div>
  </div>
</section>
      `
    }
  ],
  testimonials: [
    {
      id: 'testimonial-1',
      name: 'Centered Quote',
      html: `
<section class="py-24 bg-gray-900 text-white flex justify-center text-center">
  <div class="max-w-4xl px-4">
    <div class="text-yellow-400 text-2xl mb-6">★★★★★</div>
    <blockquote class="text-3xl md:text-4xl font-medium leading-tight mb-10">
      "This platform revolutionized the way our engineering team deploys applications. We cut our time-to-market by 60% in the first quarter alone."
    </blockquote>
    <div class="flex items-center justify-center mt-8">
      <img class="w-14 h-14 rounded-full border-2 border-gray-700 object-cover mr-4" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Sarah Jenkins">
      <div class="text-left">
        <div class="font-bold text-lg">Sarah Jenkins</div>
        <div class="text-gray-400">CTO at TechFlow</div>
      </div>
    </div>
  </div>
</section>
      `
    }
  ],
  cta: [
    {
      id: 'cta-1',
      name: 'Simple Action Banner',
      html: `
<section class="py-16 bg-blue-600 text-white">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between">
    <div class="mb-8 md:mb-0 text-center md:text-left">
      <h2 class="text-3xl font-bold mb-2">Ready to transform your business?</h2>
      <p class="text-blue-100 text-lg">Join 10,000+ companies growing faster with us.</p>
    </div>
    <div class="flex gap-4">
      <button class="px-8 py-3 bg-white text-blue-600 rounded-lg font-bold shadow-lg hover:bg-gray-50 transition">Start Free Trial</button>
    </div>
  </div>
</section>
      `
    }
  ],
  footer: [
    {
      id: 'footer-1',
      name: 'Standard Footer',
      html: `
<footer class="bg-gray-50 border-t border-gray-200 py-12">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center text-gray-500">
    <div class="mb-4 md:mb-0 font-bold text-gray-900 text-xl tracking-tight">YourBrand.</div>
    <div class="flex space-x-6 text-sm">
      <a href="#" class="hover:text-gray-900 transition">About</a>
      <a href="#" class="hover:text-gray-900 transition">Features</a>
      <a href="#" class="hover:text-gray-900 transition">Pricing</a>
      <a href="#" class="hover:text-gray-900 transition">Contact</a>
    </div>
    <div class="mt-4 md:mt-0 text-sm">
      &copy; 2026 YourBrand Inc. All rights reserved.
    </div>
  </div>
</footer>
      `
    }
  ],
  payment: [
    {
      id: 'payment-1',
      name: 'Simple Pricing Checkout',
      html: `
<section class="py-20 bg-gray-50 flex justify-center text-center">
  <div class="max-w-4xl px-4 w-full">
    <h2 class="text-3xl font-bold mb-4 text-gray-900">Simple, transparent pricing</h2>
    <p class="text-gray-600 mb-12">No hidden fees. Seamless checkout experience.</p>
    <div class="flex flex-col md:flex-row gap-8 justify-center">
      <div class="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 flex-1 relative max-w-sm mx-auto">
        <h3 class="text-xl font-bold mb-2 text-gray-900">Pro Plan</h3>
        <div class="text-4xl font-extrabold mb-6 text-gray-900">$49<span class="text-lg text-gray-500 font-normal">/mo</span></div>
        <form onsubmit="event.preventDefault(); alert('Stripe Checkout Simulator: Successful Payment!');">
          <ul class="text-left text-gray-600 space-y-3 mb-8">
            <li class="flex items-center gap-2"><div class="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs">✓</div> Unlimited Projects</li>
            <li class="flex items-center gap-2"><div class="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs">✓</div> Custom Domains</li>
            <li class="flex items-center gap-2"><div class="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs">✓</div> Priority Support</li>
            <li class="flex items-center gap-2"><div class="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs">✓</div> Advanced Analytics</li>
          </ul>
          <button type="submit" class="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition shadow-md">Subscribe via Stripe</button>
        </form>
      </div>
    </div>
  </div>
</section>
      `
    }
  ]
};
