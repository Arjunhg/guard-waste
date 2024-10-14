'use client'
import { useState, useEffect } from 'react';
import { ArrowRight, Leaf, Recycle, Coins, MapPin, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getRecentReports, getAllRewards, getWasteCollectionTasks } from '@/utils/db/actions';
import { Poppins } from 'next/font/google';
import { useAuth } from './context/AuthContext';

const poppins = Poppins({ 
  weight: ['300', '400', '600'],
  subsets: ['latin'],
  display: 'swap',
})


function AniamatedGlobe() {

  return (

    <div className="relative w-32 h-32 mx-auto mb-8">

      <div className="absolute inset-0 rounded-full bg-green-500 opacity-20 animate-pulse"></div>
      <div className="absolute inset-2 rounded-full bg-green-400 opacity-40 animate-ping"></div>
      <div className="absolute inset-4 rounded-full bg-green-300 opacity-60 animate-spin"></div>
      <div className="absolute inset-6 rounded-full bg-green-200 opacity-80 animate-bounce"></div>

      <Leaf className="absolute inset-0 m-auto h-16 w-16 text-green-600 animate-pulse" />

    </div>

  )
}

export default function Home() {

  const [impactData, setImpactData] = useState({
    wasteCollected: 0,
    reportsSubmitted: 0,
    tokensEarned: 0,
    co2Offset: 0
  })

  const { loggedIn, login, userInfo } = useAuth();

  useEffect(() => {

    async function fetchImpactData(){

      try {

        const reports = await getRecentReports(100);
        const rewards = await getAllRewards();
        const tasks = await getWasteCollectionTasks(100); 
        
        const wasteCollected = tasks.reduce((total, task) => {
          const match = task.amount.match(/(\d+(\.\d+)?)/);
          const amount = match ? parseFloat(match[0]) : 0;
          return total + amount;
        }, 0);
  
        const reportsSubmitted = reports.length;
        const tokensEarned = rewards.reduce((total, reward) => total + (reward.points || 0), 0);
        const co2Offset = wasteCollected * 0.5; //0.5kg offset of co2 per kg of waste
        
        setImpactData({
          wasteCollected: Math.round(wasteCollected * 10)/10, //round to 1 decimal places,
          reportsSubmitted,
          tokensEarned,
          co2Offset: Math.round(co2Offset * 10)/10
        });
        
      } catch (error) {
        
        console.error("Error Fetching impact data:", error);
        setImpactData({
          wasteCollected: 0,
          reportsSubmitted: 0,
          tokensEarned: 0,
          co2Offset: 0
        });
  
      }
    }

    fetchImpactData();
  
  }, []);


  return(

    <div className={`container mx-auto px-4 py-16 ${poppins.className}`}>

      <section className='text-center mb-20'>

        <AniamatedGlobe/>

        <h1 className="text-6xl font-bold mb-6 text-gray-800 tracking-tight ">
          Green Guard <span className='text-green-600'>Waste Management</span>
        </h1>

        <p className="text-xl text-gray-600">
          We are a digital platform dedicated to promoting sustainable waste management practices.
        </p>

        {loggedIn ? (
          <Link href="/report">
            <Button className="bg-green-600 hover:bg-green-700 text-white text-lg py-6 px-10 rounded-full font-medium transition-all duration-300 ease-in-out transform hover:scale-105 mt-10">
              Report Waste
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        ) : (
          <Button onClick={login} className="bg-green-600 hover:bg-green-700 text-white text-lg py-6 px-10 rounded-full font-medium transition-all duration-300 ease-in-out transform hover:scale-105 mt-10">
            Get Started
            <LogIn className="ml-2 h-5 w-5" />
          </Button>
        )}

      </section>

      {/* Feature card */}
      <section className="grid md:grid-cols-3 gap-10 mb-20">

        <FeatureCard
          icon={Leaf}
          title="Eco-Friendly"
          description="Contribute to a cleaner environment by reporting and collecting waste."
        />
        <FeatureCard
          icon={Coins}
          title="Earn Rewards"
          description="Get tokens for your contributions to waste management efforts."
        />
        <FeatureCard
          icon={MapPin}
          title="Collect Waste"
          description="Contribute to a cleaner environment by reporting and collecting waste."
        />

      </section>
      {/*  */}

      {/* Impact card */}
      <section className="bg-white p-10 rounded-3xl shadow-lg mb-20">

        <h2 className="text-4xl font-bold mb-12 text-center text-gray-800">Our Impact
        </h2>

        <div className="grid md:grid-cols-4 gap-6">

          <ImpactCard title="Waste Collected" value={`${impactData.wasteCollected} kg`} icon={Recycle} />
          <ImpactCard title="Reports Submitted" value={impactData.reportsSubmitted.toString()} icon={MapPin} />
          <ImpactCard title="Tokens Earned" value={impactData.tokensEarned.toString()} icon={Coins} />
          <ImpactCard title="CO2 Offset" value={`${impactData.co2Offset} kg`} icon={Leaf} />

        </div>

      </section>

      {loggedIn && (
        <section className="text-center mb-20">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">Welcome back, {userInfo?.name || 'User'}!</h2>
          <p className="text-xl text-gray-600">Ready to make a difference today?</p>
          <Link href="/report">
            <Button className="bg-green-600 hover:bg-green-700 text-white text-lg py-4 px-8 rounded-full font-medium transition-all duration-300 ease-in-out transform hover:scale-105 mt-6">
              Let&apos;s Report Waste Together
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </section>
      )}

    </div>

  )
}

function FeatureCard ( { icon: Icon, title, description }: { icon: React.ElementType; title: string; description: string} ) {

  return (

    <div className="relative overflow-hidden bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 ease-in-out flex flex-col items-center text-center hover:scale-105 group">
      {/* animated border */}
      <div className='absolute top-0 left-0 h-full w-0 border-4 border-green-500 transition-all duration-500 ease-in-out group-hover:w-full'></div>

      {/* Icon container */}
      <div className="bg-white p-8 rounded-xl shadow-md flex flex-col items-center text-center z-10">
        <Icon className="h-8 w-8 text-green-600" />
      </div>

      {/* Title */}
      <h3 className="text-xl font-semibold mb-4 mt-4 text-gray-800 z-10">{title}</h3>

      {/* Description */}
      <p className="text-gray-600 leading-relaxed z-10">{description}</p>

    </div>


  )

}

function ImpactCard( {title, value, icon:Icon}: { title:string; value:string | number; icon:React.ElementType } ){

  const formattedValue = typeof value === 'number' ? value.toLocaleString('en-US', { maximumFractionDigits: 1 }) : value;


  return(

    <div className="p-6 rounded-xl bg-gray-50 border border-gray-100 transition-all duration-300 ease-in-out hover:shadow-md">

      <Icon className="h-10 w-10 text-green-500 mb-4" />
      <p className="text-3xl font-bold mb-2 text-gray-800">{formattedValue}</p>
      <p className="text-sm text-gray-600">{title}</p>

    </div>
  )
}


