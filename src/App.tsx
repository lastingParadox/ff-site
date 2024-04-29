import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import FF2 from "./pages/FF2";
import FF3 from "./pages/FF3";
import RootLayout from "./pages/RootLayout";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<RootLayout />}>
                    <Route index element={<Home />} />
                    <Route path="/ff2" element={<FF2 />} />
                    <Route path="/ff3" element={<FF3 />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
