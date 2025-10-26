import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";


export default function Home() {
  return (
    <div className="bg-white text-gray-900 min-h-screen font-sans">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-white via-gray-50 to-white">
        <div className="container mx-auto px-6 py-20 flex flex-col-reverse lg:flex-row items-center lg:items-start gap-10">
          {/* Text Content */}
          <div className="lg:w-1/2 flex flex-col gap-6">
            <h1 className="text-5xl font-extrabold text-gray-900 leading-tight">
              <span className="bg-gradient-to-r from-gray-900 via-gray-700 to-black bg-clip-text text-transparent">
                AI-Powered Recruitment
              </span>
              <br /> Smarter, Faster, Better
            </h1>
            <p className="text-gray-600 text-lg">
              Automate your hiring process with AI-assisted candidate screening,{" "}
              <span className="font-semibold text-gray-900">
                real-time feedback
              </span>
              , and intelligent insights. Focus on people, not paperwork.
            </p>

            <div className="flex gap-4 mt-6">
             <Link href="/dashboard">
                <Button className="bg-black text-white hover:bg-gray-800 px-6 py-3 rounded-lg font-semibold shadow-lg">
                  Get Started
                </Button>
              </Link>
              <Button className="bg-gray-100 text-gray-900 hover:bg-gray-200 px-6 py-3 rounded-lg font-semibold shadow transition">
                📘 Learn More
              </Button>
            </div>
          </div>

          {/* Image */}
          <div className="lg:w-1/2 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md lg:max-w-lg">
              <Image
                src={"/recuiter.png"}
                alt="AI Recruiter"
                className="rounded-xl shadow-2xl hover:scale-105 transition-transform duration-500"
                width={500}
                height={500}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-12">
            Why Choose Our <span className="text-gray-700">AI Recruiter?</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl border border-gray-100 transition">
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                🎯 Smart Screening
              </h3>
              <p className="text-gray-600">
                Let AI analyze resumes, highlight top candidates, and save you
                hours of manual review.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl border border-gray-100 transition">
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                📊 Real-Time Insights
              </h3>
              <p className="text-gray-600">
                Track candidate progress, feedback, and performance metrics in
                real time on a sleek dashboard.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl border border-gray-100 transition">
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                🤝 Decision Support
              </h3>
              <p className="text-gray-600">
                AI provides recommendations and insights to help you make the
                best hiring decisions with confidence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Revolutionize Hiring?
          </h2>
          <p className="text-lg mb-8 text-gray-300">
            Sign up today and see how AI can streamline your recruitment
            workflow.
          </p>
          <Button className="bg-white text-gray-900 hover:bg-gray-200 px-8 py-3 rounded-lg font-semibold shadow-lg transition">
            Get Started Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-10">
        <div className="container mx-auto px-6 text-center">
          <p>
            &copy; {new Date().getFullYear()}{" "}
            <span className="text-white font-semibold">AI Recruiter</span>. All
            rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
