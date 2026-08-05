import { createContext, useContext } from 'react'

export const CampaignContext = createContext({ campaign: null, loading: true })

export function useCampaign() {
  return useContext(CampaignContext)
}