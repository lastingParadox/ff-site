import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import ArchivePage from './pages/ArchivePage';
import FF3 from './pages/FF3';
import RootLayout from './pages/RootLayout';
import Convert from './pages/Convert';
import Season from './pages/Season';
import './pages/page.scss';
import VortoxMachina from './pages/VortoxMachina';
import ArchivesList from './pages/ArchivesList';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<RootLayout />}>
                    <Route index element={<Home />} />
                    <Route path='archives' element={<Outlet />} >
                        <Route index element={<ArchivesList />} />
                        <Route path='ff2' element={<Season season="ff2" />} />
                        <Route path='ff2/:episode' element={<ArchivePage />} />
                        <Route path='ff3' element={<FF3 />} />
                        <Route path='ff3/:episode' element={<ArchivePage />} />
                    </Route>
                    <Route path='/cyoa' element={<VortoxMachina />} />
                    <Route path='/convert' element={<Convert />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
