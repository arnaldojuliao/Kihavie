import { useNavigate, useSearchParams } from "react-router-dom";
import SearchBar from "../components/search/SearchBar";

function Search() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get("q") ?? "";

  return (
    <SearchBar fechar={() => navigate(-1)} initialSearch={initialSearch} />
  );
}

export default Search;
