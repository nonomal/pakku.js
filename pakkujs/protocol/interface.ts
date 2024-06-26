import {egress_xml, ingress_xml, ingress_xml_content, XmlContentIngress, XmlEgress, XmlIngress} from "./interface_xml";
import {
    egress_proto, ingress_proto_history,
    ingress_proto_seg,
    ProtobufEgressSeg,
    ProtobufIngressHistory,
    ProtobufIngressSeg, ProtobufPrefetchObj
} from "./interface_protobuf";
import {DebugContentIngress, DebugEgress, egress_debug, ingress_debug_content} from "./interface_debug";
import {DanmuChunk, DanmuObject, int, MissingData} from "../core/types";

export type Ingress = XmlIngress | XmlContentIngress | ProtobufIngressSeg | ProtobufIngressHistory | DebugContentIngress;
export type Egress = XmlEgress | ProtobufEgressSeg | DebugEgress;

function ts_assert_never(x: never): never {
    throw new Error('Unexpected object: '+x);
}

export async function perform_ingress(ingress: Ingress, chunk_callback: (idx: int, chunk: DanmuChunk<DanmuObject>)=>Promise<void>, prefetch: ProtobufPrefetchObj|null = null): Promise<void> {
    if(ingress.type==='xml')
        return await ingress_xml(ingress, chunk_callback);
    else if(ingress.type==='xml_content')
        return await ingress_xml_content(ingress, chunk_callback);
    else if(ingress.type==='proto_seg')
        return await ingress_proto_seg(ingress, chunk_callback, prefetch);
    else if(ingress.type==='proto_history')
        return await ingress_proto_history(ingress, chunk_callback);
    else if(ingress.type==='debug_content')
        return await ingress_debug_content(ingress, chunk_callback);
    else
        return ts_assert_never(ingress);
}

export function perform_egress(egress: Egress, num_chunks: int, chunks: Map<int, DanmuChunk<DanmuObject>>): string | Uint8Array | typeof MissingData {
    if(egress.type==='xml')
        return egress_xml(egress, num_chunks, chunks);
    else if(egress.type==='proto_seg')
        return egress_proto(egress, num_chunks, chunks);
    else if(egress.type==='debug')
        return egress_debug(egress, num_chunks, chunks);
    else
        return ts_assert_never(egress);
}