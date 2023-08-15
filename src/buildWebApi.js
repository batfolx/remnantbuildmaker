import axios from "axios";

export default class RemnantBuildWebApi {
    static proto = "https"//"http";
    static host = "remnant-build-api.batfolx.com"//"localhost";
    static port = 443// 6776;

    static getApiUrl() {
        return `${this.proto}://${this.host}:${this.port}`;
    }

    static async uploadBuild(buildLoadout) {
        const endpoint = `${this.getApiUrl()}/build/submit`;
        const response = await axios.post(endpoint, buildLoadout);
        return response.data;
    }

    static async getBuildById(buildId) {
        const endpoint = `${this.getApiUrl()}/build/${buildId}`;
        const resp = await axios.get(endpoint);
        return resp.data;
    }


}
