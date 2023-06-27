import Header from "../components/Header";
import Footer from "../components/Footer";
import '../style/LoanVisualizationBanker.css';
import ApplicationBanker from "../components/ApplicationsBanker";


export default function LoanVisualizationBanker(){
    return (
        <>
        <Header />
        <div className="applications">
        <ApplicationBanker name="dfghjk" monthlySalary="852" tenure="25" loanAmount="985600" />
        <ApplicationBanker name="dfghjk" monthlySalary="852" tenure="25" loanAmount="985600" />
        <ApplicationBanker name="dfghjk" monthlySalary="852" tenure="25" loanAmount="985600" />
        </div>
        <Footer />

        </>
    );
}