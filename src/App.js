import BrowseCard from "./components/BrowseCard";
import SearchBar from "./components/searchBar";

export default function App() {
  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        background: "#ffffff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        gap: "10px",
      }}
    >
      <SearchBar />

      <BrowseCard
        title="Ilanora"
        description="Explore thousands of high-quality card list ui images on Dribbble. Your resource to get inspired, discover and connect with designers worldwide."
        onClick={() => alert("Test")}
      />   
      

        <BrowseCard
          title="Ilanora"
          description="Explore thousands of high-quality card list ui images on Dribbble. Your resource to get inspired, discover and connect with designers worldwide."
          onClick={() => alert("Test")}
        />      
   




    </div>

  );
}