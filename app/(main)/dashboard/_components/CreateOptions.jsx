import { Phone, Video, ArrowRight } from 'lucide-react'
import React from 'react'
import Link from 'next/link'

function CreateOptions() {
  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
        Quick Actions
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/dashboard/create-interview"
          className="group bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-400 hover:shadow-md transition-all duration-200 flex items-start gap-4"
        >
          <div className="bg-blue-100 p-3 rounded-lg group-hover:bg-blue-600 transition-colors shrink-0">
            <Video className="h-5 w-5 text-blue-600 group-hover:text-white transition-colors" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-gray-900">Create New Interview</h2>
            <p className="text-gray-500 text-sm mt-1">
              Build an AI interview and share it with candidates
            </p>
          </div>
          <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 mt-1 shrink-0 transition-colors" />
        </Link>

        <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-start gap-4 opacity-60 cursor-not-allowed">
          <div className="bg-gray-100 p-3 rounded-lg shrink-0">
            <Phone className="h-5 w-5 text-gray-500" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2 flex-wrap">
              Phone Screening
              <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-normal">
                Coming soon
              </span>
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Schedule phone screening calls with candidates
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateOptions
