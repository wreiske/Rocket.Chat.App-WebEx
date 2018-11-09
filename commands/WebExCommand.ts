import { IHttp, IModify, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { IMessageAttachment } from '@rocket.chat/apps-engine/definition/messages';
import { MessageActionType } from '@rocket.chat/apps-engine/definition/messages/MessageActionType';
import { ISlashCommand, SlashCommandContext } from '@rocket.chat/apps-engine/definition/slashcommands';

export class WebExCommand implements ISlashCommand {
    public command: string = 'webex';
    public i18nParamsExample: string = 'Slash_Command_Params_Example';
    public i18nDescription: string = 'Slash_Command_Description';
    public providesPreview: boolean = false;

    public async executor(context: SlashCommandContext, read: IRead, modify: IModify, http: IHttp): Promise<void> {
        const icon = await read.getEnvironmentReader().getSettings().getValueById('webex_icon');
        const company = await read.getEnvironmentReader().getSettings().getValueById('webex_company');
        const username = await read.getEnvironmentReader().getSettings().getValueById('webex_name');
        const messageSender = await read.getUserReader().getById(context.getSender().id);

        if (company === '') {
            const builderError = modify.getCreator().startMessage()
                .setSender(/* botUser || */ context.getSender()).setRoom(context.getRoom())
                .setText('Your administrator needs to set a WebEX company in the WebEx App.').setUsernameAlias(username).setAvatarUrl(icon);
            await modify.getNotifier().notifyUser(context.getSender(), builderError.getMessage());
            return;
        }

        let meetingUrl = '';
        if (context.getArguments().length >= 1) {
            meetingUrl = `https://${company}.webex.com/join/${context.getArguments()[0].trim()}`;
        } else {
            meetingUrl = `https://${company}.webex.com/join/${messageSender.username}`;
        }

        // NOTE: there is a bug with mobile Rocket.Chat showing "Full Name" instead of "nfull" for the username
        // NOTE: this may generate https://company.webex.com/join/Full Name which is NOT a valid link!

        const text = `@${messageSender.username} has started a WebEx Meeting: ${meetingUrl}`;

        const joinButton: IMessageAttachment = {
            actions: [{
                type: MessageActionType.BUTTON,
                text: 'Join Meeting',
                url: meetingUrl,
            }],
        };
        const builder = modify.getCreator().startMessage()
            .setSender(/* botUser || */ context.getSender()).setRoom(context.getRoom())
            .setText(text).setUsernameAlias(username).setAvatarUrl(icon).setAttachments([joinButton]);

        await modify.getCreator().finish(builder);
    }
}
