import { Link, useLocation } from "react-router-dom";
import ScrollAnimation from "./ScrollAnimation";
import { getCurrentCountryFromPath } from "@/services/countryDetection";

type CertificationProps = {
  certificateUrls?: string[]; // e.g. ["/srilanka.jpg", "/Certificatesr.jpg"]
  isoLogoUrl?: string;        // kept in props but NOT shown (per request)
};

const Certification: React.FC<CertificationProps> = ({
  certificateUrls = ["/srilanka.jpg", "/Certificatesr.jpg"],
  isoLogoUrl = "/iso1.jpg",
}) => {
  const location = useLocation();
  const detected = getCurrentCountryFromPath(location.pathname);
  const country = detected?.code ? detected : { code: "SG", name: "Singapore" };

  const getNavLink = (basePath: string) => {
    if (!country || country.code === "SG") return basePath;
    const slug = country.name.toLowerCase().replace(/\s+/g, "-");
    return `/${slug}${basePath}`;
  };

  const certs = certificateUrls.slice(0, 2);

  return (
    <section className="bg-white py-12 md:py-20">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* LEFT: two certificates */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-[980px]">
              {certs.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`Brand Leadership Award 2024 - Certificate ${i + 1}`}
                  loading="lazy"
                  className="
                    w-full
                    rounded-2xl shadow-2xl ring-1 ring-black/5
                    object-contain bg-white
                    max-h-[680px]
                  "
                />
              ))}
            </div>
          </div>

          {/* RIGHT: title + copy + bullets + button (logo removed) */}
          <div className="lg:col-span-6">
            <ScrollAnimation>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Recognized for Brand Leadership
              </h2>
              <div className="w-16 h-1 bg-gc-gold mt-3 mb-6" />

              <p className="text-gray-700 leading-relaxed mb-4">
                Awarded the <strong>Sri Lanka Brand Leadership Awards 2024</strong> by the
                World Marketing &amp; Brand Congress, recognizing our excellence in logistics and brand growth.
              </p>
              <p className="text-gray-700 leading-relaxed mb-6">
                We deliver comprehensive freight forwarding and logistics solutions that combine deep local
                expertise with an extensive global network, ensuring smooth and reliable operations for diverse industries.
              </p>

              <ul className="list-disc marker:text-gc-gold pl-5 space-y-2 text-gray-800">
                <li>Industry recognition for <strong>Brand leadership</strong></li>
                <li>
                  We are proud to be <strong>ISO 9001</strong> certified by{" "}
                  <strong>TÜV NORD CERT GmbH (Germany)</strong>.
                </li>
              </ul>

              {/* Button (logo removed as requested) */}
              <div className="mt-8">
                <Link
                  to={getNavLink("/about-us")}
                  className="inline-flex items-center justify-center rounded-md bg-gc-gold px-6 py-3 text-white hover:bg-gc-bronze transition-colors"
                >
                  Explore Our Certifications
                </Link>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Certification;
