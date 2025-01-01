package com.MainBackendService.service.SpacedRepetitionSerivce;

import com.jooq.sample.model.enums.SpacedRepetitionSpacedRepetitionName;
import com.jooq.sample.model.tables.SpacedRepetition;
import com.jooq.sample.model.tables.records.SpacedRepetitionRecord;
import org.jooq.DSLContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class SM_0_Service {

    @Autowired
    private DSLContext dslContext;


    /**
     * Initializes a spaced repetition (SM-0) record for a given flashcard.
     *
     * @param flashcardId The ID of the flashcard for which the SM-0 is initialized.
     * @return The created SpacedRepetitionRecord.
     */
    public SpacedRepetitionRecord initSM_0_forFlashcard(int flashcardId) {
        // Check if a spaced repetition record already exists for the flashcard
        SpacedRepetition spacedRepetition = SpacedRepetition.SPACED_REPETITION;
        var existingRecord = dslContext.selectFrom(spacedRepetition)
                .where(spacedRepetition.SPACED_REPETITION_FLASHCARD_ID.eq(flashcardId))
                .fetchOne();

        if (existingRecord != null) {
            throw new IllegalArgumentException("Spaced repetition record already exists for Flashcard ID: " + flashcardId);
        }

        // Create a new spaced repetition record
        SpacedRepetitionRecord smRecord = dslContext.newRecord(spacedRepetition);
        smRecord.setSpacedRepetitionFlashcardId(flashcardId);
        smRecord.setSpacedRepetitionName(SpacedRepetitionSpacedRepetitionName.SM_0);
        smRecord.setSpacedRepetitionCount(0); // Initial count
        smRecord.setSpacedRepetitionEasinessFactor(2.5); // Default EF (SuperMemo 2 default)
        smRecord.setSpacedRepetitionInterval((double) 0); // Initial interval
        smRecord.setSpacedRepetitionNextDay(LocalDate.now()); // Next day review
        // Insert the new record into the database
        smRecord.store();

        return smRecord;
    }
}
