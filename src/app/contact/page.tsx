import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { LuMapPin, LuPhone, LuMail } from "react-icons/lu";
import { PiFacebookLogoDuotone, PiTwitterLogoDuotone, PiInstagramLogoDuotone } from "react-icons/pi";

export default function ContactPage() {
  return (
    <div className="flex flex-col bg-neutral-bg">
      <section className="bg-primary text-neutral-bg py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-display font-semibold text-5xl mb-4">Get in Touch</h1>
          <p className="text-lg opacity-90">We'd love to hear from you. Reach out with any questions or feedback.</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Contact Form */}
        <div className="bg-surface p-8 rounded-3xl border border-border shadow-sm">
          <h2 className="font-display font-semibold text-3xl text-primary mb-6">Send a Message</h2>
          <form className="flex flex-col gap-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input label="Full Name" placeholder="John Doe" required />
              <Input label="Email Address" type="email" placeholder="john@example.com" required />
            </div>
            <Input label="Subject" placeholder="How can we help?" required />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text">Message</label>
              <textarea 
                className="w-full min-h-[150px] rounded-lg border border-border bg-surface px-4 py-3 text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent transition-all resize-y"
                placeholder="Type your message here..."
                required
              />
            </div>
            <Button variant="primary" className="mt-2 w-full md:w-auto">Submit Message</Button>
          </form>
        </div>

        {/* Info & Map */}
        <div className="flex flex-col gap-10">
          <div>
            <h2 className="font-display font-semibold text-3xl text-primary mb-6">Our Office</h2>
            <div className="flex flex-col gap-4 text-text">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-accent/10 text-accent flex items-center justify-center shrink-0">
                  <LuMapPin size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-lg">Address</h4>
                  <p className="text-text-muted mt-1">123 AI Boulevard, Tech Park<br/>San Francisco, CA 94107</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-accent/10 text-accent flex items-center justify-center shrink-0">
                  <LuPhone size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-lg">Phone</h4>
                  <p className="text-text-muted mt-1">+1 (555) 123-4567</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-accent/10 text-accent flex items-center justify-center shrink-0">
                  <LuMail size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-lg">Email</h4>
                  <p className="text-text-muted mt-1">hello@travix.ai</p>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full h-64 bg-border rounded-2xl overflow-hidden relative">
            {/* Fake Map */}
            <div className="absolute inset-0 bg-primary/5 flex items-center justify-center border border-border">
              <span className="text-text-muted font-medium">Interactive Map Embed Goes Here</span>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-lg text-primary mb-3">Follow Us</h4>
            <div className="flex items-center gap-4">
              <button className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center text-text hover:text-accent hover:border-accent transition-colors"><PiFacebookLogoDuotone size={20}/></button>
              <button className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center text-text hover:text-accent hover:border-accent transition-colors"><PiTwitterLogoDuotone size={20}/></button>
              <button className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center text-text hover:text-accent hover:border-accent transition-colors"><PiInstagramLogoDuotone size={20}/></button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
