import { ClipboardCheck, Package, Truck, CheckCircle } from "lucide-react";
import ScrollAnimation from "./ScrollAnimation";
const steps = [{
  id: 1,
  title: "Order Processing",
  description: "Recognize your logistic needs and professional consultation",
  icon: ClipboardCheck,
  delay: 0
}, {
  id: 2,
  title: "Warehousing",
  description: "Secure warehousing for your products before shipping",
  icon: Package,
  delay: 200
}, {
  id: 3,
  title: "Order Tracking",
  description: "Real-time tracking technology for complete visibility",
  icon: Truck,
  delay: 400
}, {
  id: 4,
  title: "Product Delivery",
  description: "Timely and secure delivery to your specified destination",
  icon: CheckCircle,
  delay: 600
}];
const WorkflowSection = () => {
  return <section className="py-16 bg-slate-100">
      <div className="container mx-auto px-4 md:px-6">
        <ScrollAnimation className="text-center mb-16">
          <span className="text-kargon-red font-medium text-sm uppercase tracking-wider">OUR PROCESS</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2">Logistics workflow</h2>
        </ScrollAnimation>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map(step => <ScrollAnimation key={step.id} delay={step.delay} className="text-center">
              <div className="relative mb-6 mx-auto w-24 h-24 rounded-full bg-white shadow-md flex items-center justify-center">
                {step.id > 1 && <div className="absolute right-full top-1/2 w-full h-0.5 bg-gray-200"></div>}
                <step.icon size={36} className="text-kargon-red" />
              </div>
              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </ScrollAnimation>)}
        </div>
      </div>
    </section>;
};
export default WorkflowSection;