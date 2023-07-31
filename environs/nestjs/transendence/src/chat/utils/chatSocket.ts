import { ClientRequestArgs } from 'http';
import { ClientOptions, WebSocket } from 'ws'

export class ChatSocket extends WebSocket {
	public opt : any | any[] | undefined;
    constructor(address: string | URL, protocols? : string | string[] | undefined, options?: ClientOptions | ClientRequestArgs | undefined, _opt?: any | any[] | undefined)
	{
		if (address)
    {
      if (protocols)
      {
        if (options)
			    super(address, protocols, options);
        else
        super(address, protocols);
      }
      else
        super(address)
    }
		else
			super(null);
		this.opt = _opt;
	};

}