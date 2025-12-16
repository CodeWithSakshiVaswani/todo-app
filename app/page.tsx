import MainComponent from "./_components/MainComponent/MainComponent";
import Navbar from "./_components/Navbar/Navbar";

const TodosPage = () => {
  return (
    <div className="bg-white h-screen flex flex-col">
      <Navbar />
      <MainComponent />
    </div>
  );
};

export default TodosPage;
