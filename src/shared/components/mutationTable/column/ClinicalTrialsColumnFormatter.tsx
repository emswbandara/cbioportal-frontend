import * as React from 'react';
import {If} from 'react-if';
import {Mutation} from "shared/api/generated/CBioPortalAPI";
import {IndicatorQueryResp, Query} from "shared/api/generated/OncoKbAPI";
import MolecularMatch from "../../trials/MolecularMatch";

export interface IClinicalTrialsColumnProps {
    enableMolecularMatch: boolean;
    molecularMatchData?: Map<string, number>;
}

export interface IClinicalTrial {
    isMolecularMatch: boolean;
    count: number | null | undefined;
   // isMatchMiner: boolean;
}


export default class ClinicalTrialsColumnFormatter
{
    public static getData(rowData:Mutation[]|undefined,
                          molecularMatchData?:Map<string, number>)
    {
        let value: IClinicalTrial;

        if (rowData) {
            const mutation = rowData[0];

            value = {
                isMolecularMatch: true,
                count: molecularMatchData ?
                    ClinicalTrialsColumnFormatter.getIndicatorData(mutation, molecularMatchData) : undefined
            };
        }
        else {
            value = {
                isMolecularMatch: false,
                count: undefined
            };
       }

        return value;
    }

    public static getIndicatorData(mutation:Mutation, molecularMatchData:any): number | null
    {
        if (molecularMatchData == null) {
            return null;
        }


        for (var key in molecularMatchData){

            if(key == (mutation.gene.hugoGeneSymbol)){ //+ " " + mutation.proteinChange
                return molecularMatchData[key] as number;
            }
        }
        // molecularMatchData.forEach((object ke) => {
        //     if(key == (mutation.gene.hugoGeneSymbol)){ //+ " " + mutation.proteinChange
        //         return value;
        //     }
        //     console.log(key, value);
        // });

        return 0;
    }


    public static renderFunction(data:Mutation[], columnProps:IClinicalTrialsColumnProps)
    {
        const trial:IClinicalTrial = ClinicalTrialsColumnFormatter.getData(
            data, columnProps.molecularMatchData);

        let evidenceQuery:Query|undefined;

        if (columnProps.molecularMatchData) {
            //evidenceQuery = this.getEvidenceQuery(data[0], columnProps.oncoKbData) || undefined;
        }

        return ClinicalTrialsColumnFormatter.mainContent(trial,
            columnProps);
    }

    public static mainContent(annotation:IClinicalTrial,
                              columnProps:IClinicalTrialsColumnProps)
    {
        return (
            <span>
                <If condition={columnProps.enableMolecularMatch || false}>
        <MolecularMatch
            count={annotation.count}
        />
        </If>
        </span>
    );
    }
}
