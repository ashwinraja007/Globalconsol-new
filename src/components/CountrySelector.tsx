import React, { useState } from 'react';
import { ChevronDown, Globe } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

interface CountryData {
  country: string;
  company: string;
  website: string;
  priority: number;
  flag?: string;
  route?: string;
}

const countries: CountryData[] = [
  { country: "SINGAPORE", company: "GC", website: "https://www.globalconsol.com", priority: 1, flag: "/sg.svg"},
  { country: "SRI LANKA", company: "GC", website: "https://www.globalconsol.com/sri-lanka/home", priority: 2, flag: "/lk.svg"},
  { country: "MYANMAR", company: "GC", website: "https://www.globalconsol.com/myanmar/home", priority: 3, flag: "/mm.svg"},
  { country: "BANGLADESH", company: "GC", website: "https://www.globalconsol.com/bangladesh/home", priority: 4, flag: "/bd.svg" },
  { country: "PAKISTAN", company: "GC", website: "https://www.globalconsol.com/pakistan/home", priority: 5, flag: "/pk.svg" },
  { country: "MALAYSIA", company: "OECL", website: "https://oecl.sg/malaysia", priority: 6, flag: "/my.svg" },
  { country: "INDONESIA", company: "OECL", website: "https://oecl.sg/indonesia", priority: 7, flag: "/id.svg" },
  { country: "THAILAND", company: "OECL", website: "https://oecl.sg/thailand", priority: 8, flag: "/th.svg" },
  { country: "INDIA", company: "OECL", website: "https://oecl.sg/india", priority: 9, flag: "/in.svg" },
  { country: "CHINA", company: "Haixun", website: "https://www.haixun.co/", priority: 10, flag: "/cn.svg" },
  { country: "AUSTRALIA", company: "GGL", website: "https://www.gglaustralia.com/", priority: 11, flag: "/au.svg" },
  { country: "QATAR", company: "ONE GLOBAL", website: "https://oneglobalqatar.com/", priority: 12, flag: "/qa.svg" },
  { country: "SAUDI ARABIA", company: "AMASS", website: "https://amassmiddleeast.com/", priority: 13, flag: "/sa.svg" },
  { country: "UAE", company: "AMASS", website: "https://amassmiddleeast.com/", priority: 14, flag: "/ae.svg" },
  { country: "USA", company: "GGL", website: "https://gglusa.us/", priority: 15, flag: "/us.svg" },
  { country: "UK", company: "GGL", website: "https://www.ggl.sg/uk", priority: 16, flag: "/gb.svg" }
];

const CountrySelector = () => {

  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const path = location.pathname.toLowerCase();

  /* -------- PATH FLAGS -------- */

  const isSingapore = path === "/";
  const isMyanmar = path.startsWith("/myanmar");
  const isSriLanka = path.startsWith("/sri-lanka");
  const isBangladesh = path.startsWith("/bangladesh");
  const isPakistan = path.startsWith("/pakistan");

  /* -------- CURRENT COUNTRY -------- */

  const detectCountry = () => {
    if (isMyanmar) return "MYANMAR";
    if (isSriLanka) return "SRI LANKA";
    if (isBangladesh) return "BANGLADESH";
    if (isPakistan) return "PAKISTAN";
    return "SINGAPORE";
  };

  const currentCountryName = detectCountry();

  /* -------- FILTER LOGIC -------- */

  let availableCountries = countries.filter(
    c => c.country !== currentCountryName
  );

  if (isBangladesh) {
    availableCountries = availableCountries.filter(
      c => !["MALAYSIA", "INDONESIA", "THAILAND"].includes(c.country)
    );
  }

  if (isMyanmar) {
    availableCountries = availableCountries.filter(
      c => c.country !== "USA"
    );
  }

  const sortedCountries = [...availableCountries].sort(
    (a, b) => a.priority - b.priority
  );

  /* -------- INDIA LOGIC -------- */

  const useGGLForIndia =
    isMyanmar || isSriLanka || isBangladesh || isPakistan;

  const getCompanyName = (country: CountryData) => {

    if (country.country === "INDIA" && useGGLForIndia) {
      return "GGL";
    }

    // UAE always display FNL
    if (country.country === "UAE") {
      return "FNL";
    }

    return country.company;
  };

  /* -------- ROUTING -------- */

  const handleCountrySelect = (country: CountryData) => {

    // INDIA
    if (country.country === "INDIA") {
      if (useGGLForIndia) {
        window.open("https://www.gglindia.com/", "_blank");
      } else {
        window.open("https://oecl.sg/india", "_blank");
      }
      return;
    }

    // UAE
    if (country.country === "UAE") {
      if (isSingapore || isMyanmar) {
        window.open("https://amassmiddleeast.com/", "_blank");
      } else {
        window.open("https://www.futurenetlogistics.com/", "_blank");
      }
      return;
    }

    // DEFAULT
    if (country.route) {
      window.location.href = country.route;
    } else {
      window.open(country.website, "_blank");
    }

    setIsOpen(false);
  };

  return (
    <div className="relative z-50 flex items-center gap-2">

      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button className="bg-black text-white rounded-full flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Switch Country <ChevronDown className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-[280px] h-[90vh] overflow-y-auto">
          <ScrollArea className="h-full">
            {sortedCountries.map((country) => (
              <DropdownMenuItem
                key={country.country}
                onSelect={(e) => {
                  e.preventDefault();
                  handleCountrySelect(country);
                }}
                className="py-4 flex items-center gap-3"
              >
                <motion.div whileHover={{ scale: 1.05 }} className="flex items-center">
                  <img
                    src={country.flag}
                    alt={country.country}
                    className="w-6 h-6 rounded-sm"
                  />
                  <div className="ml-3">
                    <div className="text-sm font-medium">
                      {country.country}
                    </div>
                    <div className="text-xs text-gray-500">
                      {getCompanyName(country)}
                    </div>
                  </div>
                </motion.div>
              </DropdownMenuItem>
            ))}
          </ScrollArea>
        </DropdownMenuContent>
      </DropdownMenu>

    </div>
  );
};

export default CountrySelector;
