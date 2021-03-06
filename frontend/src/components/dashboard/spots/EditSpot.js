import {Component} from "preact";
import {route} from "preact-router";
import {AdAxiosGet, AdAxiosPost} from "../../../auth";
import {HOST} from "../../../configs";
import PaymentMethod from "../../utils/PaymentMethod";

export default class EditSpot extends Component {
    constructor(props) {
        super(props);

        this.state = {
            contracts: [],
            ads: [],
            mode: "EDIT",
            spot: {
                id: null,
                name: `Spot #${parseInt(Math.random() * 1000)}`,
                contractId: "-1",
                fallbackAdId: "-1"
            },
            error: {}
        };

        this.updateMode();

        this.requestSpotInformation();

        this.requestContracts();
        this.requestAds();
    }

    updateMode() {
        let urlSearchParams = new URLSearchParams(location.search);

        if (urlSearchParams.get('type') === 'new')
            this.setState({mode: "NEW"});


        if (this.state.mode === 'EDIT') {
            let id = urlSearchParams.get('id');

            if (id !== null)
                this.setState({spot: {...this.state.spot, id: id}});
        }
    }

    requestSpotInformation() {
        if (this.state.mode === 'EDIT') {
            AdAxiosGet.get(`${HOST}/api/v1/spots/${this.state.spot.id}`).then((response) => {
                this.setState({spot: response.data});
            }).catch(() => {
                this.setState({mode: 'NEW'});
            });
        }
    }

    requestContracts() {
        AdAxiosGet.get(`${HOST}/api/v1/contracts/me?owner=true`).then((response) => {
            this.setState({contracts: response.data});
        })
    }

    requestAds() {
        AdAxiosGet.get(`${HOST}/api/v1/ads/me`).then((response) => {
            this.setState({ads: response.data});
        })
    }

    submitRequest() {
        let formData = new FormData();
        formData.append('id', this.state.spot.id);
        formData.append('name', this.state.spot.name);
        formData.append('contractId', this.state.spot.contractId);
        formData.append('fallbackAdId', this.state.spot.fallbackAdId);

        AdAxiosPost.post(`${HOST}/api/v1/spots`, formData).then((response) => {
            route('/dashboard/spots');
            this.props.reload();
        });
    }

    render({}, {contracts, ads, spot, error, mode}) {
        return (
            <div>
                <div style="font-family: Raleway; font-size: 30px; margin-bottom: 10px;">
                    Spot
                </div>

                <div class="mb-2 shadow-sm dashboard-info-container dashboard-container-wrapper">
                    <dl>
                        <dt>Usar anúncio de contrato</dt>
                        <dd>
                            No campo 'Contrato', selecione o contrato que deseja utilizar, com isso o Spot já funcionará.
                            É aconselhado usar um anúncio reserva caso o anúncio do contrato não possa ser exibido.
                            Para fazer isso selecione um anúncio criado por voce no campo 'Anúncio reserva'
                        </dd>
                        <dt>Usar anúncio próprio</dt>
                        <dd>
                            No campo 'Contrato', selecione a opcão 'Selecione um contrato', depois
                            selecione o anúncio que deseja usar no campo 'Anúncio reserva'
                        </dd>
                    </dl>
                </div>

                <div>
                    <div class="form-group websites-add__form">
                        <label>Nome</label>
                        <input class="form-control" value={spot.name}
                               onChange={(e) => this.setState({spot: {...spot, name: e.target.value}})}/>
                        {error.name && (
                            <small class="form-text ad-error">
                                {error.name}
                            </small>)}
                    </div>

                    <div class="form-group websites-add__form">
                        <label>Contrato (não obrigatório)</label>
                        <select class="custom-select"
                                onChange={(e) => this.setState({spot: {...spot, contractId: e.target.value}})}
                                value={this.state.spot.contractId}>
                            <option value="-1">Selecione um contrato</option>
                            {contracts && contracts.map((contract) => (
                                <option
                                    value={contract.id}>{contract.acceptorContractName || "*Contrato sem nome*"}</option>
                            ))}
                        </select>
                    </div>

                    <div class="form-group websites-add__form">
                        <label>Anúncio reserva (não obrigatório)</label>
                        <select class="custom-select"
                                onChange={(e) => this.setState({spot: {...spot, fallbackAdId: e.target.value}})}
                                value={this.state.spot.fallbackAdId}>
                            <option value="-1">Selecione um anúncio</option>
                            {ads && ads.map((ad) => (
                                <option value={ad.id}>{ad.name}</option>
                            ))}
                        </select>
                        <small class="text-muted">Esse anúncio aparecerá caso o contrato expire ou caso o dono do
                            anuncio não tenha saldo para paga-lo
                        </small>
                    </div>

                    <div class="btn dashboard-add__button" onClick={this.submitRequest.bind(this)}>
                        {mode === 'EDIT' ? 'Salvar' : 'Criar'}
                    </div>
                </div>
            </div>
        )

    }
}