import {Component} from "preact";
import "../../../styles/ae.css";
import {HOST} from "../../../configs";
import {AdAxiosGet, AdAxiosPost} from "../../../auth";
import {route} from "preact-router";

const DEFAULT_TEXT = "Anúncio de texto, voce pode alterar **o estilo** do texto nos __campos abaixo__.";
const DEFAULT_PARSED_OUTPUT = [{
    tag: 'span',
    content: 'Anúncio de texto, voce pode alterar '
}, {
    tag: 'b',
    content: 'o estilo '
}, {
    tag: 'span',
    content: 'do texto nos '
}, {
    tag: 'i',
    content: 'campos abaixo.'
}];

const DEFAULT_IMAGE_URL = "https://i.imgur.com/k2AxKqQ.png";

export default class CreateAdd extends Component {
    constructor(props) {
        super(props);

        console.log(DEFAULT_PARSED_OUTPUT);
        
        this.state = { // Default state
            error: {},
            mode: "EDIT",
            adType: "TEXT",
            adName: "",
            adRefUrl: "",
            adImageUrl: "",
            adText: DEFAULT_TEXT,
            adParsedCode: DEFAULT_PARSED_OUTPUT,
            adBgColor: "#f2f2f2",
            adTextColor: "#000",
        };

        this.ad = () => document.getElementsByClassName('ae-ad text')[0];

        this.updateMode();
        this.requestAdInformation();
    }

    updateMode() {
        if (new URLSearchParams(location.search).get('type') === 'new')
            this.setState({mode: "NEW"});
    }

    requestAdInformation() {
        if (this.state.mode !== 'EDIT')
            return;

        let id = new URLSearchParams(location.search).get('id');

        if (id !== null) {
            this.adId = id;

            AdAxiosGet.get(`${HOST}/api/v1/ads/${id}?embed=parsedOutput`).then((response) => {
                let ad = response.data;

                switch (ad.type) {
                    case 'TEXT':
                        this.setState({adType: 'TEXT'});
                        this.setState({adText: ad.text});
                        this.setState({adParsedCode: ad.parsedOutput});
                        this.setState({adBgColor: ad.bgColor});
                        this.setState({adTextColor: ad.textColor});
                        break;
                    case 'IMAGE':
                        this.setState({adType: 'IMAGE'});
                        this.setState({adImageUrl: ad.imageUrl});
                        break;
                }

                this.setState({adName: ad.name});
                this.setState({adRefUrl: ad.refUrl});
            });
        }
    }

    handleAdCheckbox(type) {
        this.setState({adType: type});
    }

    handleTextChange(e) {
        this.setState({adText: e.target.value});

        this.parseTextInput(this.state.adText);
    }

    parseTextInput(input) {
        let formData = new FormData();
        formData.append("input", input);

        AdAxiosPost.post(`${HOST}/api/v1/ads/parser`, formData).then((response) => {
            this.setState({adParsedCode: response.data});
        });
    }

    handleSubmit() {
        if (this.state.adType === 'TEXT') {
            if (!this.verifyTextAdFields())
                return;
        } else if (this.state.adType === 'IMAGE') {
            if (!this.verifyImageAdFields())
                return;
        }

        this.submitAd();
    }

    verifyTextAdFields() {
        this.setState({error: {}});

        if (!this.verifyAdName())
            return false;

        if (this.state.adText.trim().length < 5) {
            this.setState({error: {...this.state.error, adText: "O texto deve conter pelo menos 5 caracteres"}});
            return false;
        }

        if (!this.verifyRefUrl())
            return false;

        return true;
    }

    verifyImageAdFields() {
        this.setState({error: {}});

        if (!this.verifyAdName())
            return false;

        if (this.state.adImageUrl.match(/(https:\/\/)|(http:\/\/)/g) === null) {
            this.setState({error: {...this.state.error, adImage: "O URL da imagem nao e' valido"}});
            return false;
        }

        if (!this.verifyRefUrl())
            return false;

        return true;
    }

    verifyAdName() {
        if (this.state.adName.trim().length < 5) {
            this.setState({
                error: {
                    ...this.state.error,
                    adName: "O nome do anuncio deve conter pelo menos 5 caracteres"
                }
            });
            return false;
        }

        return true;
    }

    verifyRefUrl() {
        if (this.state.adRefUrl.match(/(https:\/\/)|(http:\/\/)/g) === null) {
            this.setState({error: {...this.state.error, adRefUrl: "URL invalido"}});
            return false;
        }

        return true;
    }

    submitAd() {
        let formData = this.createRequestFormData();

        let reqMode = this.state.mode === 'EDIT' ? 'put' : 'post'; // PUT or POST
        let endpoint = `${HOST}/api/v1/ads${reqMode === 'put' ? `/${this.adId}` : ''}`;

        AdAxiosPost[reqMode](endpoint, formData).then(() => {
            route('/dashboard/ads');
            this.props.reload();
        });
    }

    createRequestFormData() {
        let formData = new FormData();
        formData.append('name', this.state.adName);
        formData.append('type', this.state.adType);
        formData.append('refUrl', this.state.adRefUrl);

        switch (this.state.adType) {
            case 'TEXT':
                formData.append('text', this.state.adText);
                formData.append('bgColor', this.state.adBgColor);
                formData.append('textColor', this.state.adTextColor);
                break;
            case 'IMAGE':
                formData.append('imageUrl', this.state.adImageUrl);
                break;
        }

        return formData;
    }

    render({}, state) {
        return (
            <div>
                <div class="websites-add__container">
                    <div style="font-family: Raleway; font-size: 30px;">
                        Criar Anúncio
                    </div>

                    <div style="margin-top: 5px;">
                        <div class="form-group websites-add__form">
                            <label>Nome</label>
                            <input id="ad-name" class="form-control" value={state.adName} maxLength="60"
                                   onChange={(e) => this.setState({adName: e.target.value})}/>
                            {state.error.adName && (
                                <small class="form-text ad-error">
                                    {state.error.adName}
                                </small>)}
                        </div>

                        <div class="form-group websites-add__form">
                            <label>Modelo do Anúncio</label>
                            <div style="display: flex;">
                                <div class="ads-ad__checkbox" onClick={this.handleAdCheckbox.bind(this, 'TEXT')}>
                                    <div class="shadow ads-ad-wrapper">
                                        <TextAd
                                            parsedOutput={state.adParsedCode} bgColor={state.adBgColor}
                                            textColor={state.adTextColor}/>
                                    </div>
                                    <div
                                        class={`ads-ad__checkbox-box ${this.state.adType === 'TEXT' ? "active" : ""}`}/>
                                </div>

                                <div class="ads-ad__checkbox" onClick={this.handleAdCheckbox.bind(this, 'IMAGE')}>
                                    <div class="shadow ads-ad-wrapper">
                                        <ImageAd imageUrl={state.adImageUrl || DEFAULT_IMAGE_URL}/>
                                    </div>
                                    <div
                                        class={`ads-ad__checkbox-box ${this.state.adType === 'IMAGE' ? "active" : ""}`}/>
                                </div>
                            </div>
                        </div>

                        {this.state.adType === 'TEXT' && (
                            <div>
                                <div class="form-group websites-add__form">
                                    <label>Texto</label>
                                    <textarea id="createAdTextArea" class="form-control" value={state.adText}
                                              onChange={this.handleTextChange.bind(this)}/>
                                    <div>
                                        <small>Opções para mudar o texto</small>
                                        <br/>
                                        <small class="ml-3">__palavras em itálico__ => <i>palavras em itálico</i>
                                        </small>
                                        <br/>
                                        <small class="ml-3">**frase em negrito** => <b>frase em negrito</b></small>
                                    </div>

                                    <small class="form-text ad-error">
                                        {state.error.adText}
                                    </small>
                                </div>

                                <div class="form-group websites-add__form">
                                    <label>Cor de fundo</label>
                                    <input class="form-control ads-ad__color-picker" type="color"
                                           value={state.adBgColor}
                                           onChange={(e) => this.setState({adBgColor: e.target.value})}/>
                                </div>

                                <div class="form-group websites-add__form">
                                    <label>Cor do texto</label>
                                    <input id="ad-textColor" class="form-control ads-ad__color-picker" type="color"
                                           value={state.adTextColor}
                                           onChange={(e) => this.setState({adTextColor: e.target.value})}/>
                                </div>

                                <div class="form-group websites-add__form">
                                    <label>URL alvo do Anúncio</label>
                                    <input id="ad-refUrl" class="form-control" placeholder="https://..."
                                           value={state.adRefUrl}
                                           onChange={(e) => this.setState({adRefUrl: e.target.value})}/>
                                    {state.error.adRefUrl && (
                                        <small class="form-text ad-error">
                                            {state.error.adRefUrl}
                                        </small>)}
                                    <small class="form-text text-muted">O usuario sera redirecionado para esse link
                                        quando o anuncio for clicado.
                                    </small>
                                </div>
                            </div>
                        )}

                        {this.state.adType === 'IMAGE' && (
                            <div>
                                <span class="form-text text-muted mb-3">O formato padrão da imagem é de 1.61 : 1. Por
                                    exemplo se a imagem tiver 284px de largura, a altura deve ser 176px (176 * 1.61
                                    = 284). Caso você use outro formato de imagem, ela ficará distorcida na plataforma
                                    mas correta no website que usá-la.
                                </span>

                                <div class="form-group websites-add__form">
                                    <label>URL da Imagem</label>
                                    <input id="ad-imageUrl" type="text" class="form-control"
                                           placeholder="https://..."
                                           aria-label="URL da imagem" value={state.adImageUrl}
                                           onChange={(e) => this.setState({adImageUrl: e.target.value})}/>
                                    {state.error.adImage && (
                                        <small class="form-text ad-error">
                                            {state.error.adImage}
                                        </small>)}
                                </div>

                                <div class="form-group websites-add__form">
                                    <label>URL alvo do Anúncio</label>
                                    <input id="ad-refUrl" class="form-control" placeholder="https://..."
                                           value={state.adRefUrl}
                                           onChange={(e) => this.setState({adRefUrl: e.target.value})}/>
                                    {state.error.adRefUrl && (
                                        <small class="form-text ad-error">
                                            {state.error.adRefUrl}
                                        </small>)}
                                    <small class="form-text text-muted">O usuario sera redirecionado para esse link
                                        quando o anuncio for clicado.
                                    </small>
                                </div>
                            </div>
                        )}

                        <div class="btn dashboard-add__button"
                             onClick={this.handleSubmit.bind(this)}>
                            {state.mode === 'EDIT' ? 'Salvar' : 'Criar'}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export let TextAd = ({refUrl, parsedOutput, bgColor, textColor}) => (
    <a native href={refUrl} target="_blank" style="text-decoration: none;">
        <div class="ae-ad text"
             style={`background-color: ${bgColor || "#f2f2f2"}; color: ${textColor || "#000"};`}>
            {Array.isArray(parsedOutput) ? parsedOutput.map((node) => <CodeMapper {...node}/>) : ""}
        </div>
    </a>
);

let CodeMapper = ({tag, content}) => (
    tag === 'b' ? (<b>{content}</b>) : tag === 'i' ? (<i>{content}</i>) : (<span>{content}</span>)
);


export let ImageAd = ({refUrl, imageUrl}) => (
    <a native href={refUrl} target="_blank">
        <div class="ae-ad">
            <img src={`${imageUrl || "https://i.imgur.com/Rf1yqaY.png"}`}/>
        </div>
    </a>
);