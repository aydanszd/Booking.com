'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import RecentSearches from "@/sections/stays/Yourrecentsearches";
import StillInterestedSection from "@/sections/stays/AreYouStillInterested";
import OptionsSection from "@/sections/stays/Opportunities";
import ExplorebyFacilityType from "@/sections/stays/ExplorebyFacilityType";
import HomeGuideSection from "@/sections/stays/HomesGuestsLove";
import DealsForWeekendSection from "@/sections/stays/DealsForTheWeekend";
import UniqPropertiesSection from "@/sections/stays/UniqueProperties";
import LessSpendingSection from "@/sections/stays/LessSpending";

export default function Page() {
  const router = useRouter()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token  = params.get('token')
    const user   = params.get('user')

    if (token && user) {
      try {
        localStorage.setItem('token', token)
        localStorage.setItem('user', decodeURIComponent(user))
        // URL-i təmizlə
        window.history.replaceState({}, '', '/')
        // Səhifəni yenilə ki, header istifadəçini tanısın
        router.refresh()
      } catch (err) {
        console.error('Google auth parse xətası:', err)
      }
    }
  }, [])

  return (
    <>
      <RecentSearches />
      <StillInterestedSection />
      <OptionsSection />
      <ExplorebyFacilityType />
      <HomeGuideSection />
      <DealsForWeekendSection /> 
      <UniqPropertiesSection />
      <LessSpendingSection />
    </>
  );
}