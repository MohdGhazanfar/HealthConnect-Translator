'use client'

const Footer = () => (
  <footer className="mt-8 text-center">
    <nav className="space-x-6 mb-4">
      <a href="#" className="text-xs hover:text-primary">Privacy Policy</a>
      <a href="#" className="text-xs hover:text-primary">Terms of Service</a>
      <a href="#" className="text-xs hover:text-primary">Contact</a>
    </nav>
    <div className="bg-blue-50 p-3 rounded-md">
      <p className="text-xs text-center text-muted-foreground">
        HealthConnect Translator uses advanced AI to ensure accurate medical terminology translation.
        Your privacy and data security are our top priorities.
      </p>
    </div>
  </footer>
)

export default Footer
