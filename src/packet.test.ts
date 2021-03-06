import { LoginReq } from "./proto/protocol";
import { Command, LogicPkt, MagicLogicPktInt, print } from "./packet";
import log from 'loglevel-es';

log.setLevel("debug")
test("logicpkt", async ()=>{
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2MiOiJ0ZXN0MSIsImFwcCI6ImtpbSIsImV4cCI6MTYyOTA5MzU0OX0.P_yk1KMB5v9riUy0yW4eOTgC0k0qeB6XRjih4dL1xGk"
    let body = LoginReq.encode(LoginReq.fromJSON({
        token: token
    })).finish()
    let loginReq = LogicPkt.build(Command.SignIn, "", body);
    let buf = loginReq.bytes();
    expect(buf.readInt32BE()).toEqual(MagicLogicPktInt)
    let pkt = LogicPkt.from(buf.subarray(4))
    expect(pkt.command).toEqual(Command.SignIn)
    expect(pkt.dest).toEqual("")
    expect(pkt.sequence).toBeGreaterThan(0)
    expect(pkt.payload.length).toEqual(body.length)
    let req = LoginReq.decode(pkt.payload)
    expect(req.token).toEqual(token)    
})