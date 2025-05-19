interface ChannelDetails {
    channelId: string
    channelName: string
}

class Channels {
    private static allChannels: ChannelDetails[] = [];

    public static addChannelDetails(details: ChannelDetails) {
        this.allChannels.push(details);
    }

    public static getDetailsOfOneChannel(channelName: string) {
        return this.allChannels.find(cd => cd.channelName === channelName)
    }
}

export default Channels;