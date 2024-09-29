"use client";
import { Metadata } from "next";
import styles from "@/styles/style";
import { Hero, AdvisorCTA, Description } from "@/components";
export const metadata: Metadata = {
  title: "AI Academic Advisor - Smart Campus",
  description:
    "Get personalized course recommendations and academic advice to optimize your university journey. Stay on track with tailored suggestions from the AI Academic Advisor.",
};
import HomeLayout from "@/components/Layouts/homeLayout";

const Home: React.FC = () => {
  return (
    <>
      <HomeLayout>
        <div className="w-full overflow-hidden bg-light">
          <div className={`bg-light ${styles.flexStart}`}>
            <div className={`${styles.boxWidth}`}>
              <Hero />
            </div>
          </div>
          <div
            className={`bg-extendlight ${styles.paddingX} ${styles.flexStart}`}
          >
            <div className={`${styles.boxWidth}`}>
              <Description />
              <AdvisorCTA />
            </div>
          </div>
        </div>
      </HomeLayout>
    </>
  );
};

export default Home;
