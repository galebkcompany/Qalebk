'use client'

import { ReactNode, useState } from 'react'

type Tab = {
  label: string
  value: string
  content: ReactNode
}

export default function Tabs({ tabs }: { tabs: Tab[] }) {
  const [active, setActive] = useState(tabs[0].value)

  return (
    <div className="space-y-3">
      {/* Tab Buttons */}
      <div className="flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActive(tab.value)}
            className={`px-3 py-1 rounded ${
              active === tab.value
                ? 'bg-gray-300 text-gray-900 rounded-full px-2 py-2'
                : 'text-gray-700 rounded-full px-2 py-2'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {tabs.map(
          (tab) =>
            active === tab.value && (
              <div key={tab.value} className="mt-2">
                {tab.content}
              </div>
            )
        )}
      </div>
    </div>
  )
}
