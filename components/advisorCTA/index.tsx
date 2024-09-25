import styles from "@/styles/style";
import Button from "../Button";

const AdvisorCTA: React.FC = () => (
  <section
    className={`${styles.flexCenter} ${styles.marginY} ${styles.padding} sm:flex-row flex-col bg-black-gradient-2 rounded-[20px] box-shadow`}
  >
    <div className="flex-1 flex flex-col">
      <h2 className="text-primary font-bold">
        Discover Your Career Path Today!
      </h2>
      <p className={`${styles.paragraph} max-w-[470px] mt-5`}>
        Get personalized career advice and guidance to help you make informed
        decisions and unlock your potential.
      </p>
    </div>
    <div className={`${styles.flexCenter} sm:ml-10 ml-0 sm:mt-0 mt-10`}>
      <Button />
    </div>
  </section>
);

export default AdvisorCTA;
