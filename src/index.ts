import GaragePage from './pages/garage/garage';
import { WinnersPage } from './pages/winners/winnersPage';
import './style.scss';

const garage = new GaragePage();
garage.createView();

const winners = new WinnersPage();
winners.createView();
