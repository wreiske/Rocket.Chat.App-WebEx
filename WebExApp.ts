import {
    IConfigurationExtend, IEnvironmentRead, ILogger,
} from '@rocket.chat/apps-engine/definition/accessors';
import { App } from '@rocket.chat/apps-engine/definition/App';
import { IAppInfo } from '@rocket.chat/apps-engine/definition/metadata';
import { SettingType } from '@rocket.chat/apps-engine/definition/settings';

import { WebExCommand } from './commands/WebExCommand';

export class WebExApp extends App {

    constructor(info: IAppInfo, logger: ILogger) {
        super(info, logger);
    }

    protected async extendConfiguration(configuration: IConfigurationExtend, environmentRead: IEnvironmentRead): Promise<void> {
        await configuration.settings.provideSetting({
            id: 'webex_name',
            type: SettingType.STRING,
            packageValue: 'WebEx Meetings',
            required: true,
            public: false,
            i18nLabel: 'Customize_Name',
            i18nDescription: 'Customize_Name_Description',
        });       
        
        await configuration.settings.provideSetting({
            id: 'webex_company',
            type: SettingType.STRING,
            packageValue: '',
            required: true,
            public: false,
            i18nLabel: 'Customize_Company',
            i18nDescription: 'Customize_Company_Description',
        });

        await configuration.settings.provideSetting({
            id: 'webex_icon',
            type: SettingType.STRING,
            packageValue: 'https://slack-files2.s3-us-west-2.amazonaws.com/avatars/2018-06-17/384053245894_495b0d8bc7454e59a3c8_512.png',
            required: true,
            public: false,
            i18nLabel: 'Customize_Icon',
            i18nDescription: 'Customize_Icon_Description',
        });

        await configuration.slashCommands.provideSlashCommand(new WebExCommand());
    }

}
