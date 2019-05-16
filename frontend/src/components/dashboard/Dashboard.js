import {Component} from "preact";
import {Link} from 'preact-router/match'
import Websites from './websites/Websites';
import Match from '../utils/Match';
import Proposals from "./proposals/Proposals";
import Ads from "./ads/Ads";
import Contracts from "./contracts/Contracts";
import Spots from "./spots/Spots";
import ControlPanel from "./controlPanel/ControlPanel";
import Account from "./account/Account";

export default class Dashboard extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id="dashboard" class="h-100">
                <div class="dashboard__sidebar">
                    <div class="dashboard__sidebar-logo">
                        <span>AdExchange</span>
                    </div>
                    <div class="dashboard__sidebar-bar d-flex flex-column">
                        <div>
                            <div class="dashboard__sidebar--item">
                                <Link href="/dashboard/panel" activeClassName="active">
                                    <div class="dashboard__sidebar--item-container">Dashboard</div>
                                </Link>
                            </div>
                            <div class="dashboard__sidebar--item">
                                <Link href="/dashboard/websites" activeClassName="active">
                                    <div class="dashboard__sidebar--item-container">Websites</div>
                                </Link>
                            </div>
                            <div class="dashboard__sidebar--item">
                                <Link href="/dashboard/proposals" activeClassName="active">
                                    <div class="dashboard__sidebar--item-container">Propostas</div>
                                </Link>
                            </div>
                            <div class="dashboard__sidebar--item">
                                <Link href="/dashboard/contracts" activeClassName="active">
                                    <div class="dashboard__sidebar--item-container">Contratos</div>
                                </Link>
                            </div>
                            <div class="dashboard__sidebar--item">
                                <Link href="/dashboard/ads" activeClassName="active">
                                    <div class="dashboard__sidebar--item-container">Anúncios</div>
                                </Link>
                            </div>
                            <div class="dashboard__sidebar--item">
                                <Link href="/dashboard/spots" activeClassName="active">
                                    <div class="dashboard__sidebar--item-container">Spots</div>
                                </Link>
                            </div>
                        </div>
                        <div class="flex-grow-1 d-flex flex-column justify-content-end">
                            <div class="dashboard__sidebar--item">
                                <Link href="/dashboard/account" activeClassName="active">
                                    <div class="dashboard__sidebar--item-container">Conta</div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="dashboard__main">
                    <div class="dashboard__main-topbar">
                        <div class="dashboard__main-topbar__left">
                            <div class="dashboard__main-topbar--item">
                                <Link href="/" activeClassName="active">
                                    <div>Home</div>
                                </Link>
                            </div>
                            <div class="dashboard__main-topbar--item ml-4">
                                <span>Saldo: R$ </span>
                            </div>
                        </div>
                        <div class="dashboard__main-topbar__right">
                            <div class="d-inline-block align-self-center">
                                {/*<Dropdown text="Menu">
                                    <div class="dropdown-item">
                                        <Link href="/auth/logout" activeClassName="active">
                                            Logout
                                        </Link>
                                    </div>
                                </Dropdown>*/}
                                <div class="dashboard__main-topbar--item">
                                    <Link href="/auth/logout" activeClassName="active">
                                        Logout
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="dashboard__main-content">
                        <div style="height: 100%; padding: 16px;">
                            <Match path="/dashboard/panel" include>
                                <ControlPanel/>
                            </Match>

                            <Match path="/dashboard/websites" include>
                                <Websites/>
                            </Match>

                            <Match path="/dashboard/proposals" include>
                                <Proposals/>
                            </Match>

                            <Match path="/dashboard/contracts" include>
                                <Contracts/>
                            </Match>

                            <Match path="/dashboard/ads" include>
                                <Ads/>
                            </Match>

                            <Match path="/dashboard/spots" include>
                                <Spots/>
                            </Match>

                            <Match path="/dashboard/account" include>
                                <Account/>
                            </Match>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
