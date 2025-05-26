namespace inv;


entity priceshistory{

    key ID      :Integer;
    DATE        :DateTime;
    OPEN        :Decimal;
    HIGH        :Decimal;
    LOW         :Decimal;
    CLOSE       :Decimal;
    VOLUME      :Decimal;

};


entity strategies {
    key ID          : String;
        NAME        : String;
        DESCRIPTION : String;
        RULES       : array of StrategyRule;
        DETAIL_ROW  : array of DetailRow;
}
type StrategyRule : {
    INDICATOR : String;
    PERIOD    : Integer;
    CONDITION : String;
    ACTION    : String;
};

type DetailRow : {
    ACTIVED        : Boolean;
    DELETED        : Boolean;
    DETAIL_ROW_REG : array of DetailRowReg;
};

type DetailRowReg : {
    CURRENT : Boolean;
    REGDATE : DateTime;
    REGTIME : DateTime; 
    REGUSER : String;
};

type Signal : {
    Date      : DateTime;    // "2024-05-08T12:00:00Z"
    Type      : String;      // "buy" | "sell"
    Price     : Decimal(18,8);
    Reasoning : String;
}

type SpecType : {
  INDICATOR : String(30);
  VALUE     : Decimal(18,8);
};

entity SIMULATION {
    key IDSIMULATION       : String;              // "SOL_USDT_TBS_20240501_001"
        USERID             : String;              // "USER_TEST"
        IDSTRATEGY         : String;              // "TBS"
        SIMULATIONNAME     : String;              // "Turtle Soup Swing SOL/USDT"
        SYMBOL             : String;              // "SOL_USDT"
        STARTDATE          : DateTime;            // "2024-05-01"
        ENDDATE            : DateTime;            // "2024-06-30"
        AMOUNT             : Decimal(18,8);       // "1000"
        SPECS              : array of SpecType;        
        RESULT             : Decimal(18,8);       // 30.00
        PERCENTAGERETURN   : Decimal(5,4);        // 0.03
        SIGNALS            : array of Signal;     // array de señales
        DETAILROW          : array of DetailRow;  // reuso de tu tipo existente
}

