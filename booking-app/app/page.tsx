import RecentSearches from "@/sections/stays/Yourrecentsearches";
import StillInterestedSection from "@/sections/stays/AreYouStillInterested";
import OptionsSection from "@/sections/stays/Opportunities";
import ExplorebyFacilityType from "@/sections/stays/ExplorebyFacilityType";
import HomeGuideSection from "@/sections/stays/HomesGuestsLove";
import DealsForWeekendSection from "@/sections/stays/DealsForTheWeekend";
import UniqPropertiesSection from "@/sections/stays/UniqueProperties";
import LessSpendingSection from "@/sections/stays/LessSpending";
export default function Page() {
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