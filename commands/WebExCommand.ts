import { IHttp, IModify, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { ISlashCommand, SlashCommandContext } from '@rocket.chat/apps-engine/definition/slashcommands';

export class WebExCommand implements ISlashCommand {
    public command: string = 'webex';
    public i18nParamsExample: string = 'Slash_Command_Params_Example';
    public i18nDescription: string = 'Slash_Command_Description';
    public providesPreview: boolean = false;

    public async executor(context: SlashCommandContext, read: IRead, modify: IModify, http: IHttp): Promise<void> {
        const icon = await read.getEnvironmentReader().getSettings().getValueById('webex_icon');
        const company = await read.getEnvironmentReader().getSettings().getValueById('webex_company');
        
        //NOTE: there is a bug with mobile Rocket.Chat showing "Full Name" instead of "nfull" for the username
        //NOTE: this may generate https://company.webex.com/join/Full Name which is NOT a valid link!

        var meetingUrl = "";
        if(context.getArguments().length >= 1){
            meetingUrl = `https://${company}.webex.com/join/${context.getArguments()[0].trim()}`;
        } else {
            meetingUrl = `https://${company}.webex.com/join/${context.getSender().username}`;
        }
        const text = `@${context.getSender().username} has started a WebEx Meeting: ${meetingUrl}`;
        const username = await read.getEnvironmentReader().getSettings().getValueById('webex_name');

        const builder = modify.getCreator().startMessage()
            .setSender(/* botUser || */ context.getSender()).setRoom(context.getRoom())
            .setText(text).setUsernameAlias(username).setAvatarUrl(icon);
            
        await modify.getCreator().finish(builder);
    }
}
