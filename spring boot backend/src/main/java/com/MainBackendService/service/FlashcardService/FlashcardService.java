package com.MainBackendService.service.FlashcardService;

import com.MainBackendService.dto.createDto.CreateFlashcardDto;
import com.jooq.sample.model.tables.Flashcard;
import com.jooq.sample.model.tables.Vocab;
import com.jooq.sample.model.tables.records.FlashcardRecord;
import org.jooq.DSLContext;
import org.jooq.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class FlashcardService {

    @Autowired
    private DSLContext dslContext;

    /**
     * Initializes a new Flashcard for a Vocabulary in a given Desk.
     *
     * @param vocabId The ID of the Vocabulary for which the Flashcard is created.
     * @return The created FlashcardRecord.
     */
    public FlashcardRecord initFlashcardForVocabularyInDesk(int vocabId) {
        // Retrieve the vocabulary details
        Vocab vocab = Vocab.VOCAB;
        var vocabRecord = dslContext.select(vocab.VOCAB_TEXT, vocab.VOCAB_MEANING, vocab.VOCAB_IMAGE, vocab.VOCAB_DESK_ID)
                .from(vocab)
                .where(vocab.VOCAB_ID.eq(vocabId))
                .fetchOne();

        if (vocabRecord == null) {
            throw new IllegalArgumentException("Vocabulary not found for ID: " + vocabId);
        }

        // Create a new Flashcard record
        Flashcard flashcard = Flashcard.FLASHCARD;
        FlashcardRecord flashcardRecord = dslContext.newRecord(flashcard);
        flashcardRecord.setFlashcardFrontText(vocabRecord.getValue(vocab.VOCAB_TEXT));
        flashcardRecord.setFlashcardBackText(vocabRecord.getValue(vocab.VOCAB_MEANING));
        flashcardRecord.setFlashcardFrontImage(vocabRecord.getValue(vocab.VOCAB_IMAGE));
        flashcardRecord.setFlashcardVocabId(vocabId);
        flashcardRecord.setFlashcardDeskId(vocabRecord.getValue(vocab.VOCAB_DESK_ID));

        // Insert the new Flashcard into the database
        flashcardRecord.store();

        return flashcardRecord;
    }


    /**
     * Initializes flashcards for all vocabularies in a given desk.
     *
     * @param deskId The ID of the desk for which the flashcards are initialized.
     * @return A list of created FlashcardRecords.
     */
    public List<FlashcardRecord> initFlashcardInDesk(int deskId) {
        // Retrieve vocabularies associated with the desk
        Vocab vocab = Vocab.VOCAB;
        Result<?> vocabRecords = dslContext.select(vocab.VOCAB_ID, vocab.VOCAB_TEXT, vocab.VOCAB_MEANING, vocab.VOCAB_IMAGE)
                .from(vocab)
                .where(vocab.VOCAB_DESK_ID.eq(deskId))
                .fetch();

        if (vocabRecords.isEmpty()) {
            throw new IllegalArgumentException("No vocabularies found for Desk ID: " + deskId);
        }

        // Initialize flashcards for each vocabulary
        Flashcard flashcard = Flashcard.FLASHCARD;
        List<FlashcardRecord> flashcardRecords = new ArrayList<>();

        for (var vocabRecord : vocabRecords) {
            FlashcardRecord flashcardRecord = dslContext.newRecord(flashcard);
            flashcardRecord.setFlashcardFrontText(vocabRecord.getValue(vocab.VOCAB_TEXT, String.class));
            flashcardRecord.setFlashcardBackText(vocabRecord.getValue(vocab.VOCAB_MEANING, String.class));
            flashcardRecord.setFlashcardFrontImage(vocabRecord.getValue(vocab.VOCAB_IMAGE, String.class));
            flashcardRecord.setFlashcardVocabId(vocabRecord.getValue(vocab.VOCAB_ID, Integer.class));
            flashcardRecord.setFlashcardDeskId(deskId);

            // Insert each flashcard into the database
            flashcardRecord.store();

            // Add to the list of created flashcards
            flashcardRecords.add(flashcardRecord);
        }

        return flashcardRecords;
    }

    /**
     * Creates a new Flashcard in a given Desk based on provided FlashcardDto.
     *
     * @param deskId             The ID of the desk in which the flashcard will be created.
     * @param createFlashcardDto The data transfer object containing the flashcard details.
     * @return The created FlashcardRecord.
     */
    public FlashcardRecord createFlashcardInDesk(int deskId, CreateFlashcardDto createFlashcardDto) {
        // Validate required fields in FlashcardDto
        if (createFlashcardDto.getFront_text() == null || createFlashcardDto.getFront_text().isBlank()) {
            throw new IllegalArgumentException("Front text cannot be null or blank.");
        }

        if (createFlashcardDto.getBack_text() == null || createFlashcardDto.getBack_text().isBlank()) {
            throw new IllegalArgumentException("Back text cannot be null or blank.");
        }

        // Create a new Flashcard record
        Flashcard flashcard = Flashcard.FLASHCARD;
        FlashcardRecord flashcardRecord = dslContext.newRecord(flashcard);

        flashcardRecord.setFlashcardDeskId(deskId);
        flashcardRecord.setFlashcardFrontImage(createFlashcardDto.getFront_image());
        flashcardRecord.setFlashcardFrontSound(createFlashcardDto.getFront_sound());
        flashcardRecord.setFlashcardFrontText(createFlashcardDto.getFront_text());
        flashcardRecord.setFlashcardBackImage(createFlashcardDto.getBack_image());
        flashcardRecord.setFlashcardBackSound(createFlashcardDto.getBack_sound());
        flashcardRecord.setFlashcardBackText(createFlashcardDto.getBack_text());

        // Store the flashcard in the database
        flashcardRecord.store();

        return flashcardRecord;
    }

}

