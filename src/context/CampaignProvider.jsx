import { useState, useEffect } from 'react'
import { CampaignContext } from './campaign'
import { getActiveCampaign } from '../services/campaigns'

export default function CampaignProvider({ children }) {
  const [campaign, setCampaign] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    getActiveCampaign()
      .then((c) => { if (active) setCampaign(c) })
      .catch(() => {})
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  return (
    <CampaignContext.Provider value={{ campaign, loading }}>
      {children}
    </CampaignContext.Provider>
  )
}