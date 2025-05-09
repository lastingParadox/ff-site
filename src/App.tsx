import { BrowserRouter, Outlet, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import ArchivePage from './pages/ArchivePage';
import FF3 from './pages/FF3';
import RootLayout from './pages/RootLayout';
import Convert from './pages/Convert';
import Season from './pages/Season';
import './pages/page.scss';
import VortoxMachina from './pages/VortoxMachina';
import ArchivesList from './pages/ArchivesList';
import NotFound from '@/pages/404';

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
                    <Route path="*" element={<RedirectOldPath />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

function RedirectOldPath() {
    const location = useLocation();
    const oldPaths = ['ff1', 'ff2', 'ff3', 'ff4', 'vm'];

    const [firstSegment, ...restSegments] = location.pathname.split('/').filter(Boolean);

    if (oldPaths.includes(firstSegment)) {
        const newPath = `/archives/${firstSegment}/${restSegments.join('/')}`;
        return <Navigate to={`${newPath}${location.search}`} replace />;
    }

    return <NotFound />;
}

export default App;
