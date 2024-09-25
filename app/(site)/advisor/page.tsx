"use client"
import styles from "@/styles/style";
import { Hero, AdvisorCTA, Description } from "@/components"
const Home: React.FC = () => {
  return (
    <>
      <div className="bg-light w-full overflow-hidden">
       
        <div className={`bg-light ${styles.flexStart}`}>
          <div className={`${styles.boxWidth}`}>
            <Hero />
          </div>
        </div>
        <div className={`bg-extendlight ${styles.paddingX} ${styles.flexStart}`}>
          <div className={`${styles.boxWidth}`}>
            <Description />
            <AdvisorCTA />
          </div>
        </div>
      </div>
    </>
  )
}

export default Home